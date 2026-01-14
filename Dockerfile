# 使用官方的 Nginx 镜像作为基础镜像，alpine 版本更轻量
FROM nginx:alpine

# 将你项目中的 dist 目录里的所有内容，
# 复制到 Nginx 镜像默认提供网页服务的目录中
# 注意：命令中的 '.' 代表目标目录，也就是 Nginx 的默认目录
COPY ./dist /usr/share/nginx/html

# 暴露 80 端口，这是 Nginx 默认的 HTTP 端口
EXPOSE 80

# Nginx 镜像已经内置了启动命令，所以这里不需要再写 CMD
