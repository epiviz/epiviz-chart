FROM node

LABEL maintainer="Jayaram Kancherla <jayaram.kancherla@gmail.com>"

RUN apt-get update && \
    apt-get install -y --no-install-recommends vim nginx git default-jre && \
    apt-get clean && \
    npm install -g gulp bower polymer-cli --unsafe-perm 

EXPOSE 8081 
EXPOSE 80

RUN mkdir -p /app
WORKDIR /app
ADD . /app
RUN bower install --allow-root

COPY ./epiviz-chart.conf /etc/nginx/sites-enabled/epiviz.conf

# CMD bash
# RUN polymer serve -H 0.0.0.0
CMD ["./epiviz-chart.sh"]
