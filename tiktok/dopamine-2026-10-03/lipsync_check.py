import cv2, numpy as np, subprocess, sys, json
import mediapipe as mp
from mediapipe.tasks import python as mpt
from mediapipe.tasks.python import vision
S='/tmp/claude-0/-home-user-mycloudecode/81bb6e8a-7e15-506e-a1cf-922a06a26f69/scratchpad'
opts=vision.FaceLandmarkerOptions(base_options=mpt.BaseOptions(model_asset_path=S+'/face_landmarker.task'),running_mode=vision.RunningMode.VIDEO,num_faces=1)
lm=vision.FaceLandmarker.create_from_options(opts)
def mar_series(path, t0=0, t1=None):
    cap=cv2.VideoCapture(path); fps=cap.get(cv2.CAP_PROP_FPS); out=[]; i=0
    while True:
        ok,fr=cap.read()
        if not ok: break
        t=i/fps; i+=1
        if t<t0: continue
        if t1 is not None and t>t1: break
        img=mp.Image(image_format=mp.ImageFormat.SRGB,data=cv2.cvtColor(fr,cv2.COLOR_BGR2RGB))
        r=lm.detect_for_video(img,int(t*1000)+1)
        if not r.face_landmarks: out.append(np.nan); continue
        p=r.face_landmarks[0]
        gap=abs(p[13].y-p[14].y); face=abs(p[10].y-p[152].y)
        out.append(gap/face)
    return np.array(out), fps
def env(path, ss=0, t=None):
    cmd=['ffmpeg','-nostdin','-loglevel','error','-ss',str(ss),'-i',path]+(['-t',str(t)] if t else [])+['-ac','1','-ar','48000','-f','f32le','-']
    x=np.frombuffer(subprocess.run(cmd,capture_output=True).stdout,np.float32); hop=1600
    return np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2)) for i in range(len(x)//hop)])
def best_lag(m,e,rng=10):
    res=[]
    for lag in range(-rng,rng+1):  # positive lag: video lags audio
        a=m[rng+lag:len(m)-rng+lag]; b=e[rng:len(m)-rng]; n=min(len(a),len(b)); a=a[:n]; b=b[:n]
        ok=~np.isnan(a); res.append((lag,np.corrcoef(a[ok],b[ok])[0,1]))
    return max(res,key=lambda z:z[1]), dict(res)[0]
mode=sys.argv[1]
if mode=='raw':
    for w in ['W1','W2','W3']:
        m,fps=mar_series(f'{S}/gen/{w}.mp4'); e=env(f'{S}/edit/{w}.mp3')
        (lag,r),r0=best_lag(m,e); print(f'RAW {w}: best lag {lag:+d} frames r={r:.2f} (r@0={r0:.2f})',flush=True)
else:
    H=2.6
    m,fps=mar_series(f'{S}/final.mp4')
    e=np.r_[np.zeros(int(H*30)),env(f'{S}/mix/vo_n.wav')]
    for name,(a0,a1) in {'S4 W1':(4.25,8.4),'S7 W2':(16.0,21.4),'S8 W2':(21.5,23.4),'S11 W3':(27.35,31.9)}.items():
        i0,i1=int((H+a0)*30),int((H+a1)*30)
        (lag,r),r0=best_lag(m[i0-10:i1+10],e[i0-10:i1+10]); print(f'FINAL {name}: best lag {lag:+d} r={r:.2f} (r@0={r0:.2f})',flush=True)
