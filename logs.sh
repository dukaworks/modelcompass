#!/bin/bash
#
# ModelCompass 日志查看器
# 用法: ./logs.sh [选项]
#

LOG_FILE="/tmp/modelcompass-backend.log"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${BLUE}🧭 ModelCompass 日志查看器${NC}"
    echo ""
    echo "用法:"
    echo "  ./logs.sh         - 显示最新 50 行日志"
    echo "  ./logs.sh -f      - 实时跟踪日志 (tail -f)"
    echo "  ./logs.sh -a      - 显示全部日志"
    echo "  ./logs.sh -e      - 只显示错误日志"
    echo "  ./logs.sh -c      - 清空日志文件"
    echo "  ./logs.sh status  - 检查服务状态"
    echo ""
}

# 检查日志文件是否存在
check_log() {
    if [ ! -f "$LOG_FILE" ]; then
        echo -e "${RED}❌ 日志文件不存在: $LOG_FILE${NC}"
        echo "后端服务可能尚未启动"
        exit 1
    fi
}

# 显示最新日志
show_latest() {
    check_log
    echo -e "${BLUE}📝 最新 50 行日志:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    tail -n 50 "$LOG_FILE" | while IFS= read -r line; do
        colorize_log "$line"
    done
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 颜色化日志输出
colorize_log() {
    local line="$1"
    if echo "$line" | grep -q "ERROR\|Error\|error\|❌"; then
        echo -e "${RED}$line${NC}"
    elif echo "$line" | grep -q "✅\|success\|completed"; then
        echo -e "${GREEN}$line${NC}"
    elif echo "$line" | grep -q "🚀\|🧭\|🕷️\|💓"; then
        echo -e "${YELLOW}$line${NC}"
    elif echo "$line" | grep -q "GET\|POST\|PUT\|DELETE"; then
        echo -e "${BLUE}$line${NC}"
    else
        echo "$line"
    fi
}

# 实时跟踪日志
follow_log() {
    check_log
    echo -e "${GREEN}👀 实时跟踪日志 (按 Ctrl+C 退出)...${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    tail -f "$LOG_FILE" | while IFS= read -r line; do
        colorize_log "$line"
    done
}

# 显示全部日志
show_all() {
    check_log
    echo -e "${BLUE}📄 全部日志:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat "$LOG_FILE" | while IFS= read -r line; do
        colorize_log "$line"
    done
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 只显示错误
show_errors() {
    check_log
    echo -e "${RED}❌ 错误日志:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    grep -i "error\|Error\|ERROR\|❌" "$LOG_FILE" | while IFS= read -r line; do
        colorize_log "$line"
    done
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 清空日志
clear_log() {
    if [ -f "$LOG_FILE" ]; then
        > "$LOG_FILE"
        echo -e "${GREEN}✅ 日志已清空${NC}"
    else
        echo -e "${YELLOW}⚠️ 日志文件不存在${NC}"
    fi
}

# 检查服务状态
check_status() {
    echo -e "${BLUE}🔍 服务状态检查:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 检查后端进程
    if pgrep -f "tsx watch src/index.ts" > /dev/null; then
        echo -e "${GREEN}✅ 后端服务运行中${NC}"
        pgrep -f "tsx watch src/index.ts" | head -1
    else
        echo -e "${RED}❌ 后端服务未运行${NC}"
    fi
    
    # 检查 PostgreSQL
    if docker ps | grep -q "modelcompass-db"; then
        echo -e "${GREEN}✅ PostgreSQL 运行中${NC}"
    else
        echo -e "${RED}❌ PostgreSQL 未运行${NC}"
    fi
    
    # 检查端口
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 端口 3001 已监听${NC}"
    else
        echo -e "${YELLOW}⚠️ 端口 3001 未监听${NC}"
    fi
    
    # 日志文件大小
    if [ -f "$LOG_FILE" ]; then
        local size=$(du -h "$LOG_FILE" | cut -f1)
        echo -e "${BLUE}📝 日志文件大小: $size${NC}"
        local lines=$(wc -l < "$LOG_FILE")
        echo -e "${BLUE}📝 日志行数: $lines${NC}"
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 主程序
case "${1:-}" in
    -h|--help)
        show_help
        ;;
    -f|--follow)
        follow_log
        ;;
    -a|--all)
        show_all
        ;;
    -e|--errors)
        show_errors
        ;;
    -c|--clear)
        clear_log
        ;;
    status)
        check_status
        ;;
    *)
        show_latest
        ;;
esac
