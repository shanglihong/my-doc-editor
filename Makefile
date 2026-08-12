# 前端项目快捷管理与启动 Makefile

.PHONY: help install dev build preview test clean

help:
	@echo "可用开发指令:"
	@echo "  make dev      - 启动前端开发服务器 (Vite dev server)"
	@echo "  make install  - 安装前端依赖包"
	@echo "  make build    - 编译构建生产环境产物"
	@echo "  make test     - 运行自动化单元测试"
	@echo "  make clean    - 清理构建产物与临时缓存"

dev:
	cd frontend && npm run dev

install:
	cd frontend && npm install --legacy-peer-deps

build:
	cd frontend && npm run build

preview:
	cd frontend && npm run preview

test:
	cd frontend && npm test

clean:
	rm -rf frontend/dist frontend/node_modules/.cache
