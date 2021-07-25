FROM dorowu/ubuntu-desktop-lxde-vnc:focal

RUN apt-get update && apt-get install -y build-essential ffmpeg vim tmux unzip pulseaudio pavucontrol
RUN wget --content-disposition --progress=dot:giga 'https://discordapp.com/api/download?platform=linux&format=deb' && apt-get install -y ./discord-*.deb
RUN useradd -ms /bin/bash desktop -u 1000
RUN echo 'desktop ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
RUN sudo -u desktop -H /bin/bash -c "curl https://get.volta.sh | bash"
RUN sudo -u desktop -H /bin/bash -c "source ~/.profile; volta install node npm yarn"
COPY ./rootfs/ /