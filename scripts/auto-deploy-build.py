import os
import shutil
import subprocess

branch_name = 'build'
local_name = 'remote_build'
build_name = 'build'

def run_cmd(cmd, cwd=None):
    print(f"👉 执行命令: {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd)
    if result.returncode != 0:
        print("❌ 命令执行失败！")
        exit(1)

def main():
    # 1. 删除 remote_build 目录
    remote_build_dir = os.path.join(os.getcwd(), local_name)
    if os.path.exists(remote_build_dir):
        print(f"🧹 正在删除 {local_name} 目录...")
        shutil.rmtree(remote_build_dir)

    # 2. git clone docs 分支到 remote_build 目录
    repo_url = "git@github.com:pysunday/sdenv-extend.git"
    print(f"📥 正在克隆 blog 分支到本地目录 {local_name}...")
    run_cmd(f"git clone --depth 1 -b {branch_name} {repo_url} {local_name}")

    site_dir = os.path.join(os.getcwd(), build_name)
    if not os.path.exists(site_dir):
        print(f"❌ 错误: {build_name} 目录不存在！")
        exit(1)

    print(f"📋 正在复制 {build_name} 内容到 {local_name}...")
    for item in os.listdir(site_dir):
        s = os.path.join(site_dir, item)
        d = os.path.join(remote_build_dir, item)
        if os.path.isdir(s):
            if os.path.exists(d):
                shutil.rmtree(d)
            shutil.copytree(s, d)
        else:
            shutil.copy2(s, d)
    # 4. 在 remote_build 目录执行 git push
    print("🚀 准备 push 到远程仓库...")
    run_cmd("git add .", cwd=remote_build_dir)
    run_cmd('git commit -m "自动更新 remote_build 内容"', cwd=remote_build_dir)
    run_cmd("git push", cwd=remote_build_dir)
    print("✅ 上传成功！查看地址: https://raw.githubusercontent.com/pysunday/sdenv-extend/refs/heads/build/sdenv-extend-iife.min.js")

if __name__ == "__main__":
    main()
