FROM java:8

RUN apt-get update
RUN apt-get -y install nginx
RUN apt-get -y install maven
ADD ./config/lanches.jar /tmp/lanches.jar

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

EXPOSE 80 8080 8081
ENTRYPOINT sh -c 'service nginx start && nohup java -jar /tmp/lanches.jar --server.port=8081'