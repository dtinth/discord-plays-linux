FROM dorowu/ubuntu-desktop-lxde-vnc:focal

RUN apt-get update && apt-get install -y build-essential ffmpeg vim tmux unzip pulseaudio pavucontrol fonts-noto fonts-noto-cjk fonts-noto-color-emoji xdotool git
RUN wget --content-disposition --progress=dot:giga 'https://discordapp.com/api/download?platform=linux&format=deb' && apt-get install -y ./discord-*.deb
RUN wget --progress=dot:giga 'https://github.com/themix-project/oomox/releases/download/1.13.3/oomox_1.13.3_18.10+.deb' && apt-get install -y ./oomox_1.13.3_18.10+.deb
RUN useradd -ms /bin/bash desktop -u 1000
RUN echo 'desktop ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
RUN sudo -u desktop -H /bin/bash -c "curl https://get.volta.sh | bash"
RUN sudo -u desktop -H /bin/bash -c "source ~/.profile; volta install node npm yarn"
COPY ./rootfs/ /