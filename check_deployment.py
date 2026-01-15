#!/usr/bin/env python3
"""
部署前檢查腳本
檢查項目是否準備好部署到 GitHub + Netlify
"""

import os
import sys
import json

def check_file_exists(filename, description):
    """檢查文件是否存在"""
    if os.path.exists(filename):
        print(f"✅ {description}: {filename}")
        return True
    else:
        print(f"❌ {description}: {filename} - 文件不存在")
        return False

def check_file_content(filename, required_strings):
    """檢查文件內容是否包含必要字符串"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        all_found = True
        for string in required_strings:
            if string in content:
                print(f"  ✅ 包含: {string}")
            else:
                print(f"  ❌ 缺少: {string}")
                all_found = False
        
        return all_found
    except Exception as e:
        print(f"  ❌ 讀取錯誤: {e}")
        return False

def check_git_status():
    """檢查 Git 狀態"""
    print("\n🔍 檢查 Git 狀態...")
    
    # 檢查是否為 Git 倉庫
    if not os.path.exists('.git'):
        print("❌ 不是 Git 倉庫")
        return False
    
    # 檢查是否有未提交的更改
    try:
        import subprocess
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True)
        if result.stdout.strip():
            print("⚠️  有未提交的更改:")
            print(result.stdout)
            return False
        else:
            print("✅ 沒有未提交的更改")
            return True
    except Exception as e:
        print(f"❌ Git 檢查失敗: {e}")
        return False

def main():
    print("=" * 60)
    print("部署前檢查 - Bank Offers 項目")
    print("=" * 60)
    
    all_checks_passed = True
    
    # 檢查必要文件
    print("\n📁 檢查必要文件...")
    required_files = [
        ('.gitignore', 'Git 忽略文件'),
        ('README.md', '項目說明文件'),
        ('index.html', '主頁面'),
        ('style.css', '樣式文件'),
        ('script.js', 'JavaScript 文件'),
        ('netlify.toml', 'Netlify 配置'),
        ('netlify/functions/chat.js', 'Netlify Function'),
        ('.env.example', '環境變量示例'),
        ('DEPLOYMENT_GUIDE.md', '部署指南'),
    ]
    
    for filename, description in required_files:
        if not check_file_exists(filename, description):
            all_checks_passed = False
    
    # 檢查 package.json
    print("\n📦 檢查 package.json...")
    if check_file_exists('package.json', 'Package.json'):
        try:
            with open('package.json', 'r', encoding='utf-8') as f:
                package = json.load(f)
            
            required_fields = ['name', 'version', 'description', 'scripts']
            for field in required_fields:
                if field in package:
                    print(f"  ✅ {field}: {package[field]}")
                else:
                    print(f"  ❌ 缺少字段: {field}")
                    all_checks_passed = False
        except json.JSONDecodeError as e:
            print(f"  ❌ JSON 解析錯誤: {e}")
            all_checks_passed = False
    
    # 檢查敏感信息
    print("\n🔒 檢查敏感信息...")
    
    # 檢查 script.js 中的 Firebase 配置
    print("檢查 script.js 中的 Firebase 配置...")
    if check_file_exists('script.js', ''):
        with open('script.js', 'r', encoding='utf-8') as f:
            script_content = f.read()
        
        # 檢查是否有硬編碼的真實 API 密鑰
        suspicious_strings = [
            'AIzaSy',  # Firebase API 密鑰開頭
            'sk-',     # OpenAI/Groq API 密鑰開頭
            'Bearer ', # Bearer token
        ]
        
        found_sensitive = False
        for suspicious in suspicious_strings:
            if suspicious in script_content:
                print(f"  ⚠️  發現可能敏感字符串: {suspicious}...")
                found_sensitive = True
        
        if found_sensitive:
            print("  ⚠️  警告: 發現可能敏感信息，請確認是否為測試密鑰")
        else:
            print("  ✅ 未發現明顯敏感信息")
    
    # 檢查 .env.example
    print("\n檢查 .env.example 示例文件...")
    if check_file_exists('.env.example', ''):
        required_env_vars = ['FIREBASE_API_KEY', 'GROQ_API_KEY', 'GEMINI_API_KEY']
        check_file_content('.env.example', required_env_vars)
    
    # 檢查 Git 狀態
    git_ok = check_git_status()
    if not git_ok:
        all_checks_passed = False
    
    # 總結
    print("\n" + "=" * 60)
    print("檢查結果總結")
    print("=" * 60)
    
    if all_checks_passed:
        print("🎉 所有檢查通過！項目已準備好部署。")
        print("\n下一步:")
        print("1. 創建 GitHub 倉庫: https://github.com/new")
        print("2. 添加遠程倉庫: git remote add origin <你的倉庫URL>")
        print("3. 推送到 GitHub: git push -u origin main")
        print("4. 部署到 Netlify: https://app.netlify.com")
        return 0
    else:
        print("⚠️  發現問題，請修復後再部署。")
        print("\n常見問題解決:")
        print("1. 缺少文件 - 創建必要文件")
        print("2. 敏感信息 - 使用環境變量代替硬編碼")
        print("3. Git 問題 - 提交所有更改")
        return 1

if __name__ == '__main__':
    sys.exit(main())
