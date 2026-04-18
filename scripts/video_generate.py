#!/usr/bin/env python3
import os
import sys
import json
import time
import argparse
import requests

# 配置
API_KEY_ENV_VARS = ['ARK_API_KEY', 'MODEL_VIDEO_API_KEY', 'MODEL_AGENT_API_KEY']
DEFAULT_API_BASE = "https://ark-cn-beijing.bytedance.net/api/v3"
DEFAULT_MODEL_NAME = "doubao-seedance-1-0-pro-250528"
MAX_WAIT_SECONDS = 1200

class VideoGenerator:
    def __init__(self, api_key=None, api_base=None, model_name=None):
        self.api_key = api_key or self._get_api_key()
        self.api_base = api_base or DEFAULT_API_BASE
        self.model_name = model_name or DEFAULT_MODEL_NAME
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def _get_api_key(self):
        """从环境变量获取 API Key"""
        for env_var in API_KEY_ENV_VARS:
            if env_var in os.environ:
                return os.environ[env_var]
        raise PermissionError(
            "ARK_API_KEY or MODEL_VIDEO_API_KEY or MODEL_AGENT_API_KEY not found in environment variables"
        )
    
    def generate_video(self, params):
        """生成视频"""
        url = f"{self.api_base}/videos/generations"
        data = {
            "model": self.model_name,
            "prompt": params.get("prompt"),
            "ratio": params.get("ratio", "16:9"),
            "duration": params.get("duration", 5),
            "resolution": params.get("resolution", "720p"),
            "watermark": params.get("watermark", True),
        }
        
        # 处理输入素材
        if "first_frame" in params:
            data["first_frame"] = params["first_frame"]
        if "last_frame" in params:
            data["last_frame"] = params["last_frame"]
        if "reference_images" in params:
            data["reference_images"] = params["reference_images"]
        if "reference_videos" in params:
            data["reference_videos"] = params["reference_videos"]
        if "reference_audios" in params:
            data["reference_audios"] = params["reference_audios"]
        if "generate_audio" in params:
            data["generate_audio"] = params["generate_audio"]
        if "seed" in params:
            data["seed"] = params["seed"]
        
        response = requests.post(url, headers=self.headers, json=data, timeout=30)
        response.raise_for_status()
        return response.json()
    
    def get_task_status(self, task_id):
        """获取任务状态"""
        url = f"{self.api_base}/videos/generations/{task_id}"
        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()
        return response.json()
    
    def wait_for_completion(self, task_id, max_wait_seconds=MAX_WAIT_SECONDS):
        """等待任务完成"""
        start_time = time.time()
        while time.time() - start_time < max_wait_seconds:
            status = self.get_task_status(task_id)
            if status.get("status") == "succeeded":
                return status
            elif status.get("status") == "failed":
                raise Exception(f"Video generation failed: {status.get('error', 'Unknown error')}")
            time.sleep(5)
        raise TimeoutError(f"Video generation timed out after {max_wait_seconds} seconds")

def parse_args():
    parser = argparse.ArgumentParser(description="Video generation tool using Seedance models")
    parser.add_argument("--prompt", "-p", type=str, required=False, help="Text description of the video")
    parser.add_argument("--name", "-n", type=str, default="video", help="Video name identifier")
    parser.add_argument("--model", "-m", type=str, default=DEFAULT_MODEL_NAME, help="Model name")
    parser.add_argument("--ratio", "-r", type=str, default="16:9", help="Aspect ratio")
    parser.add_argument("--duration", "-d", type=int, default=5, help="Video duration in seconds")
    parser.add_argument("--resolution", type=str, default="720p", help="Video resolution")
    parser.add_argument("--first-frame", "-f", type=str, default=None, help="First frame image URL")
    parser.add_argument("--last-frame", "-l", type=str, default=None, help="Last frame image URL")
    parser.add_argument("--ref-images", nargs="+", default=[], help="Reference image URLs")
    parser.add_argument("--ref-videos", nargs="+", default=[], help="Reference video URLs")
    parser.add_argument("--ref-audios", nargs="+", default=[], help="Reference audio URLs")
    parser.add_argument("--generate-audio", action="store_true", help="Generate audio (Seedance 1.5 only)")
    parser.add_argument("--seed", type=int, default=None, help="Random seed for reproducibility")
    parser.add_argument("--no-watermark", action="store_true", help="Disable watermark")
    parser.add_argument("--timeout", "-t", type=int, default=MAX_WAIT_SECONDS, help="Max wait time in seconds")
    parser.add_argument("--query-task", "-q", type=str, default=None, help="Query task status by task_id")
    return parser.parse_args()

def main():
    args = parse_args()
    
    try:
        generator = VideoGenerator(model_name=args.model)
        
        if args.query_task:
            # 查询任务状态
            status = generator.get_task_status(args.query_task)
            print(json.dumps(status, ensure_ascii=False, indent=2))
            return
        
        if not args.prompt:
            print(json.dumps({
                "status": "error",
                "error_details": [{"video_name": args.name, "error": "Prompt is required"}]
            }, ensure_ascii=False))
            return
        
        # 构建参数
        params = {
            "prompt": args.prompt,
            "ratio": args.ratio,
            "duration": args.duration,
            "resolution": args.resolution,
            "watermark": not args.no_watermark,
        }
        
        if args.first_frame:
            params["first_frame"] = args.first_frame
        if args.last_frame:
            params["last_frame"] = args.last_frame
        if args.ref_images:
            params["reference_images"] = args.ref_images
        if args.ref_videos:
            params["reference_videos"] = args.ref_videos
        if args.ref_audios:
            params["reference_audios"] = args.ref_audios
        if args.generate_audio:
            params["generate_audio"] = True
        if args.seed is not None:
            params["seed"] = args.seed
        
        # 生成视频
        result = generator.generate_video(params)
        task_id = result.get("task_id")
        
        if not task_id:
            print(json.dumps({
                "status": "error",
                "error_details": [{"video_name": args.name, "error": "No task_id returned"}]
            }, ensure_ascii=False))
            return
        
        # 等待完成
        try:
            completed = generator.wait_for_completion(task_id, args.timeout)
            video_url = completed.get("data", {}).get("video_url")
            
            if video_url:
                print(json.dumps({
                    "status": "success",
                    "success_list": [{"video_name": args.name, "url": video_url}],
                    "error_list": [],
                    "error_details": [],
                    "pending_list": []
                }, ensure_ascii=False))
            else:
                print(json.dumps({
                    "status": "error",
                    "error_details": [{"video_name": args.name, "error": "No video URL returned"}]
                }, ensure_ascii=False))
        except TimeoutError as e:
            print(json.dumps({
                "status": "partial_success",
                "success_list": [],
                "error_list": [args.name],
                "error_details": [{"video_name": args.name, "error": str(e)}],
                "pending_list": [{"video_name": args.name, "task_id": task_id}]
            }, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "error_details": [{"video_name": args.name, "error": str(e)}]
        }, ensure_ascii=False))
        return

if __name__ == "__main__":
    main()
