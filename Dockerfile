FROM nginx:alpine

# Copy custom configuration file from the current directory
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy static assets from the current directory
# Note: This simply copies EVERYTHING in the build context.
# If you have large unrelated files (like .git, .rar), you might want a .dockerignore
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
