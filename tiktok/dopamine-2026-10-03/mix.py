import subprocess, json, numpy as np, re, sys
S='/tmp/claude-0/-home-user-mycloudecode/81bb6e8a-7e15-506e-a1cf-922a06a26f69/scratchpad'
L=S+'/sfxlib'; SR=48000
H=2.6; TOTAL=round((2.6+31.95+0.5)*30)/30
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

# --- voice ---
loudnorm(S+'/edit/vo_main.wav','vo_n.wav',-14)
vo=load('vo_n.wav'); place(vo, H)
# --- hook audio (song from the previous video) ---
subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-ss','11.87','-i',S+'/ref/dopamine_prev.mp4','-t','2.6','-vn','-af','afade=t=in:d=0.02,afade=t=out:st=2.55:d=0.05','-ar','48000','-ac','2','hook_raw.wav'],check=True)
hk=load('hook_raw.wav'); place(hk, 0.0, -15.5-rms_db(hk)+(-1.0))
# --- music ---
mu=load(L+'/music_trapanomics.mp3', 0, TOTAL-H+0.2, f'afade=t=in:d=0.12,afade=t=out:st={TOTAL-H-1.4:.2f}:d=1.4')
music_gain=-31.5-rms_db(mu)
place(mu, H, music_gain)

# --- SFX: (file, abs_time, target_rms_db, align, opts) align='peak' lands the loudest point on abs_time
V=lambda vo: H+vo
EV=[
 ('sfx_1093.mp3', 0.0,    -33, 'start', dict(t=0.6)),            # rewind glitch into the replay
 ('sfx_1492.mp3', V(0.0), -29, 'peak',  {}),                     # whoosh: hook -> chart
 ('sfx_2364.mp3', V(0.5), -31, 'start', dict(t=0.4)),            # pop on "לגרף?"
 ('sfx_1491.mp3', V(1.35),-33, 'peak',  {}),                     # soft whoosh -> A-roll
 ('sfx_1490.mp3', V(2.95),-31, 'peak',  {}),                     # whoosh -> BUY insert
 ('sfx_275.mp3',  V(3.2), -29, 'start', {}),                     # click on the BUY press
 ('sfx_1489.mp3', V(4.2), -34, 'peak',  {}),                     # air whoosh back to A-roll
 ('sfx_2356.mp3', V(7.51),-31, 'start', {}),                     # dry pop on "גם כשזה לא"
 ('sfx_2595.mp3', V(8.45),-32, 'start', dict(t=0.5)),            # glitch into chart panel
 ('sfx_1109.mp3', V(9.4), -31, 'start', dict(t=0.35)),           # stop drag 1
 ('sfx_1117.mp3', V(10.05),-31,'start', {}),                     # stop drag 2
 ('sfx_2358.mp3', V(11.42),-31,'start', {}),                     # contracts x2
 ('sfx_2364.mp3', V(11.62),-30,'start', dict(t=0.4)),            # contracts x4
 ('sfx_1117.mp3', V(12.9), -31,'start', {}),                     # extra entry
 ('sfx_1109.mp3', V(13.2), -31,'start', dict(t=0.35)),           # extra entry
 ('sfx_1486.mp3', V(13.7), -33,'end_rev', dict(t=1.6)),          # riser (reversed whoosh) peaking on the reveal
 ('sfx_2902.mp3', V(13.7), -26,'peak',  dict(t=1.6)),            # BOOM 1: casino reveal
 ('sfx_1939.mp3', V(14.25),-32,'start', {}),                     # chips clatter
 ('sfx_1491.mp3', V(14.66),-32,'peak',  {}),                     # swipe on the strike-through
 ('sfx_1993.mp3', V(15.0), -30,'start', {}),                     # coins clink on "להמר"
 ('sfx_1995.mp3', V(15.05),-36,'start', dict(t=0.9)),            # slot machine flavour (very low)
 ('sfx_1492.mp3', V(15.98),-32,'peak',  dict(pitch=0.89)),       # whoosh (pitched) -> A-roll
 ('sfx_2354.mp3', V(18.56),-32,'start', {}),                     # card in
 ('sfx_2358.mp3', V(19.28),-31,'start', {}),                     # "התוכנית"
 ('sfx_2364.mp3', V(20.6), -30,'start', dict(t=0.4)),            # "ריגוש?"
 ('sfx_1133.mp3', V(21.45),-31,'start', {}),                     # shutter on jump-cut zoom
 ('sfx_1490.mp3', V(23.45),-32,'peak',  dict(pitch=1.08)),       # whoosh -> step-away
 ('sfx_490.mp3',  V(25.3), -27,'start', {}),                     # heartbeat: stillness
 ('sfx_2356.mp3', V(26.44),-30,'start', {}),                     # pop "זאת החלטה"
 ('sfx_2354.mp3', V(27.45),-32,'start', {}),                     # CTA line
 ('sfx_2358.mp3', V(28.66),-31,'start', {}),                     # comments chip
 ('sfx_2364.mp3', V(29.72),-30,'start', dict(t=0.4)),            # follow pill
 ('sfx_1117.mp3', V(30.35),-30,'start', {}),                     # follow press click
]
for fn,t,tgt,align,o in EV:
    extra=''
    if 'pitch' in o: extra=f"asetrate={int(48000*o['pitch'])},aresample=48000"
    x=load(L+'/'+fn, None, o.get('t'), extra)
    fade=int(0.015*SR)
    if len(x)>2*fade:
        x[-fade:]*=np.linspace(1,0,fade)[:,None]
    if align=='end_rev':
        x=x[::-1].copy(); start=t-len(x)/SR
    elif align=='peak':
        start=t-peak_t(x)
    else:
        start=t
    g=tgt-rms_db(x)
    place(x,start,g)
    print(f'{fn:14s} t={t:6.2f} start={start:6.2f} gain={g:+5.1f}')
pk=np.abs(bus).max(); print('bus peak',pk)
bus=bus/max(1.0,pk*1.05)
subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','pcm_s24le','mix_raw.wav'],input=bus.tobytes(),check=True)
loudnorm('mix_raw.wav','mix_final.wav',-14)
print('done', TOTAL)
