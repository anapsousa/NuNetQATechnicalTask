# Update package lists and install required tools
FROM ubuntu:latest

# Update package lists and install required tools
RUN apt-get update && apt-get install -y \
    iputils-ping \
    iperf3 \
    iproute2 \
    dnsutils \
    curl \
    gnupg

CMD ["/bin/bash", "-c", "while true; do sleep 30; done;"]
