import subprocess, json, numpy as np
from faster_whisper import WhisperModel
SR=48000
def load(p):
    return np.frombuffer(subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-i',p,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout,np.float32).copy()
def trim(x, thr_db=-42, pad=0.05):
    fr=int(0.01*SR); e=np.array([np.sqrt(np.mean(x[i*fr:(i+1)*fr]**2)+1e-12) for i in range(len(x)//fr)])
    on=np.where(20*np.log10(e)>thr_db)[0]
    a=max(0,on[0]*fr-int(pad*SR)); b=min(len(x),(on[-1]+1)*fr+int(pad*SR))
    y=x[a:b].copy(); f=int(0.006*SR); y[:f]*=np.linspace(0,1,f); y[-f:]*=np.linspace(1,0,f); return y
def rms(x):
    fr=1024; e=np.array([np.sqrt(np.mean(x[i*fr:(i+1)*fr]**2)) for i in range(len(x)//fr)]); a=e[e>10**(-45/20)]; return np.sqrt(np.mean(a**2))
segs=[('V1','vo/V1_b.mp3'),('V2','vo/V2_a.mp3'),('V3','vo/V3_b.mp3'),('V4','vo/V4_a.mp3'),('V5','vo/V5_b.mp3'),('V6','vo/V6_b.mp3')]
gaps={'V1':0.80,'V2':0.25,'V3':0.30,'V4':0.15,'V5':0.15}
X={k:trim(load(p)) for k,p in segs}
ref=rms(X['V2'])
for k in X: X[k]*=ref/rms(X[k])
m=WhisperModel("ivrit-ai/whisper-large-v3-turbo-ct2", device="cpu", compute_type="int8", cpu_threads=4)
t=0.0; out=[]; marks={}
for k,_ in segs:
    x=X[k]; d=len(x)/SR
    subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-ar','16000','/tmp/seg.wav'],input=x.tobytes(),check=True)
    ws,_=m.transcribe('/tmp/seg.wav',language='he',word_timestamps=True,beam_size=5)
    words=[{'w':w.word.strip(),'s':round(t+w.start,3),'e':round(t+w.end,3)} for s in ws for w in s.words]
    marks[k]={'from':round(t,3),'to':round(t+d,3),'words':words}
    out.append(x); t+=d
    if k in gaps: out.append(np.zeros(int(gaps[k]*SR),np.float32)); t+=gaps[k]
v=np.concatenate(out)
subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','vo_v3.wav'],input=v.tobytes(),check=True)
json.dump(marks,open('vo_v3_marks.json','w'),ensure_ascii=False,indent=1)
print('total',round(t,3))
for k in marks: print(k,marks[k]['from'],marks[k]['to'],' '.join(f"{w['w']}[{w['s']:.2f}]" for w in marks[k]['words']))
