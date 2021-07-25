# shared-desktop-on-discord

A shared Linux container that can be controlled by anyone on Discord.

## Components

- A desktop Linux container.
- An agent to control the VM.
- A Discord bot that talks to the agent.

## Notes

```sh
# PulseAudio
sudo apt install pulseaudio pavucontrol

# Desktop
load-module module-native-protocol-tcp auth-anonymous=true

# Discord
load-module module-tunnel-source server=desktop source=auto_null.monitor source_name=desktop
ffplay -f x11grab -video_size 1280x720 -i desktop:1.0
```
