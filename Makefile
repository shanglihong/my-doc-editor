# my-doc-editor 项目快捷管理 Makefile

.PHONY: help install dev build preview test clean

help:
	@echo "可用开发指令:"
	@echo "  make dev      - 启动前端开发服务器 (Vite dev server)"
	@echo "  make install  - 安装依赖包"
	@echo "  make build    - 编译构建生产环境产物"
	@echo "  make test     - 运行自动化单元测试"
	@echo "  make clean    - 清理构建产物与临时缓存"

dev:
	npm run dev

install:
	npm install --legacy-peer-deps

build:
	npm run build

preview:
	npm run preview

test:
	npm test

clean:
	rm -rf dist node_modules/.cache
