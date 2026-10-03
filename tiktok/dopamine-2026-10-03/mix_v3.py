import subprocess, json, numpy as np, re, sys
S='/tmp/claude-0/-home-user-mycloudecode/81bb6e8a-7e15-506e-a1cf-922a06a26f69/scratchpad'
L=S+'/sfxlib'; SR=48000
H=0.0; TOTAL=round((31.63+1.0)*30)/30
def load(path, ss=None, t=None, extra=''):
    cmd=['ffmpeg','-nostdin','-loglevel','error']
    if ss is not None: cmd+=['-ss',str(ss)]
    cmd+=['-i',path]
    if t is not None: cmd+=['-t',str(t)]
    af='aresample=48000'+(','+extra if extra else '')
    cmd+=['-af',af,'-ac','2','-ar',str(SR),'-f','f32le','-']
    x=np.frombuffer(subprocess.run(cmd,capture_output=True,check=True).stdout,np.float32).reshape(-1,2)
    return x.copy()
def rms_db(x):
    # RMS of the loud part (frames above -45 dBFS)
    m=x.mean(1); fr=1024; n=len(m)//fr
    if n==0: return 20*np.log10(np.sqrt(np.mean(m**2))+1e-9)
    e=np.array([np.sqrt(np.mean(m[i*fr:(i+1)*fr]**2)) for i in range(n)])
    act=e[e>10**(-45/20)]
    return 20*np.log10(np.sqrt(np.mean(act**2))+1e-9) if len(act) else -90
def peak_t(x):
    m=np.abs(x.mean(1)); fr=480; n=len(m)//fr
    e=np.array([np.sqrt(np.mean(m[i*fr:(i+1)*fr]**2)) for i in range(n)])
    return int(np.argmax(e))*fr/SR
def loudnorm(path_in, path_out, target):
    r=subprocess.run(['ffmpeg','-nostdin','-hide_banner','-i',path_in,'-af',f'loudnorm=I={target}:TP=-2:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
    j=json.loads(r[r.rfind('{'):r.rfind('}')+1])
    subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-i',path_in,'-af',
        f"loudnorm=I={target}:TP=-2:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true",
        '-ar','48000','-ac','2',path_out],check=True)

N=int(round(TOTAL*SR)); bus=np.zeros((N,2),np.float32)
def place(x, t, gain_db=0.0):
    i=int(round(t*SR)); x=x*(10**(gain_db/20))
    if i<0: x=x[-i:]; i=0
    j=min(N,i+len(x)); bus[i:j]+=x[:j-i]


# --- voice: elevenlabs_v4 dialogue with the voice element ---
loudnorm(S+'/mix/vo_v3.wav','vo3_n.wav',-14)
vo=load('vo3_n.wav'); place(vo, 0.0)
# --- loop ending: the song from the previous video ("...דופמין")
subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-ss','13.56','-i',S+'/ref/dopamine_prev.mp4','-t','1.0','-vn','-af','afade=t=in:d=0.03,afade=t=out:st=0.85:d=0.15','-ar','48000','-ac','2','loop_raw.wav'],check=True)
lp=load('loop_raw.wav'); place(lp, 31.63, -15.5-rms_db(lp))
# --- music: from frame 0, out under the loop song ---
mu=load(L+'/music_trapanomics.mp3', 0, 31.95, 'afade=t=in:d=0.05,afade=t=out:st=31.4:d=0.55')
place(mu, 0.0, -31.5-rms_db(mu))
EV=[
 ('sfx_1939.mp3', 0.45, -31,'start', {}),               # chips clatter
 ('sfx_1491.mp3', 1.14, -32,'peak', {}),                # swipe: strike-through on "לסחור"
 ('sfx_2902.mp3', 1.52, -26,'peak', dict(t=1.6)),       # BOOM 1: "התחלנו להמר"
 ('sfx_1993.mp3', 1.64, -31,'start', {}),               # coins
 ('sfx_2595.mp3', 2.77, -31,'start', dict(t=0.5)),      # glitch into the chart flash
 ('sfx_1117.mp3', 2.94, -31,'start', {}),               # P&L ticks
 ('sfx_1109.mp3', 3.10, -31,'start', dict(t=0.35)),
 ('sfx_1117.mp3', 3.26, -31,'start', {}),
 ('sfx_1490.mp3', 3.57, -31,'peak', {}),                # whoosh -> desk
 ('sfx_1489.mp3', 4.49, -34,'peak', {}),                # air whoosh -> BUY screen
 ('sfx_275.mp3',  4.79, -29,'start', {}),               # the BUY click on "הריגוש"
 ('sfx_1491.mp3', 5.40, -34,'peak', {}),                # -> leaning back
 ('sfx_2595.mp3', 8.85, -33,'start', dict(t=0.4)),      # into the green illusion
 ('sfx_2356.mp3', 9.59, -29,'start', {}),               # "לא." slam
 ('sfx_2596.mp3', 10.10,-33,'start', dict(t=0.45)),     # electric whoosh into chart
 ('sfx_1109.mp3', 10.75,-31,'start', dict(t=0.35)),     # stop drag 1
 ('sfx_1117.mp3', 11.45,-31,'start', {}),               # stop drag 2
 ('sfx_2358.mp3', 12.74,-31,'start', {}),               # contract x2
 ('sfx_1109.mp3', 13.65,-31,'start', dict(t=0.35)),     # stop drag 3
 ('sfx_2364.mp3', 14.44,-30,'start', dict(t=0.4)),      # another trade, x3
 ('sfx_2902.mp3', 14.75,-30,'peak', dict(t=1.6)),       # BOOM 2 (soft): "נפלת במבחן"
 ('sfx_787.mp3',  15.10,-33,'peak', {}),                # whoosh -> rules
 ('sfx_2354.mp3', 15.12,-32,'start', {}),               # rules title
 ('sfx_2356.mp3', 15.19,-31,'start', {}),               # rule 1
 ('sfx_2358.mp3', 16.75,-31,'start', {}),               # rule 2
 ('sfx_2364.mp3', 18.71,-31,'start', dict(t=0.4)),      # rule 3 (+ cut to second still)
 ('sfx_2354.mp3', 21.03,-31,'start', {}),               # rule 4
 ('sfx_1489.mp3', 23.75,-34,'peak', {}),                # -> decision
 ('sfx_490.mp3',  23.82,-28,'start', {}),               # heartbeat
 ('sfx_2356.mp3', 25.26,-30,'start', {}),               # "זאת החלטה" slam
 ('sfx_1490.mp3', 26.36,-34,'peak', dict(pitch=1.08)),  # -> CTA
 ('sfx_2354.mp3', 26.41,-32,'start', {}),               # CTA title
 ('sfx_2358.mp3', 27.33,-31,'start', {}),               # option 1
 ('sfx_1117.mp3', 28.61,-31,'start', {}),               # "1" pulse
 ('sfx_2364.mp3', 29.17,-31,'start', dict(t=0.4)),      # option 2
 ('sfx_1109.mp3', 30.63,-31,'start', dict(t=0.35)),     # "2" pulse
 ('sfx_2358.mp3', 30.90,-32,'start', {}),               # follow pill
 ('sfx_1093.mp3', 31.63,-31,'start', dict(t=0.45)),     # rewind glitch into the loop
]
for fn,t,tgt,align,o in EV:
    extra=''
    if 'pitch' in o: extra=f"asetrate={int(48000*o['pitch'])},aresample=48000"
    x=load(L+'/'+fn, None, o.get('t'), extra)
    fade=int(0.015*SR)
    if len(x)>2*fade: x[-fade:]*=np.linspace(1,0,fade)[:,None]
    start=t-peak_t(x) if align=='peak' else t
    place(x,start,tgt-rms_db(x))
pk=np.abs(bus).max(); print('bus peak',pk)
bus=bus/max(1.0,pk*1.05)
subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','pcm_s24le','mix3_raw.wav'],input=bus.tobytes(),check=True)
loudnorm('mix3_raw.wav','mix3_final.wav',-14)
print('done', TOTAL)
