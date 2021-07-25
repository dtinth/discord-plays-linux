FROM dorowu/ubuntu-desktop-lxde-vnc:focal

RUN apt-get update && apt-get install -y build-essential ffmpeg vim tmux unzip pulseaudio pavucontrol fonts-noto fonts-noto-cjk fonts-noto-color-emoji xdotool git kwin
RUN wget --content-disposition --progress=dot:giga 'https://discordapp.com/api/download?platform=linux&format=deb' && apt-get install -y ./discord-*.deb
RUN wget --progress=dot:giga 'https://github.com/themix-project/oomox/releases/download/1.13.3/oomox_1.13.3_18.10+.deb' && apt-get install -y ./oomox_1.13.3_18.10+.deb
RUN useradd --create-home --shell /bin/bash desktop -u 1000
RUN echo 'desktop ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
RUN sudo -u desktop -H /bin/bash -c 'touch ~/.bashrc; curl https://get.volta.sh | bash'
RUN sudo -u desktop -H /bin/bash -c 'source ~/.profile; volta install node npm yarn'
RUN sudo -u desktop -H /bin/bash -c 'echo ~/; ls -la ~'
RUN sudo -u desktop -H /bin/bash -c 'mkdir -p ~/.config/pcmanfm/LXDE/ && cp /usr/local/share/doro-lxde-wallpapers/desktop-items-0.conf ~/.config/pcmanfm/LXDE/'
RUN sudo -u desktop -H /bin/bash -c 'mkdir ~/.config/pulse'
RUN sed -i -e "s|chown|true|" /startup.sh
COPY ./rootfs/ /
RUN cd /etc/supervisor/conf.d && patch supervisord.conf supervisord.conf.patch
