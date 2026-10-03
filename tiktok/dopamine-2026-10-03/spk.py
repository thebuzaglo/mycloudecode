import sys, json, numpy as np, torch, torchaudio, librosa
from speechbrain.inference.speaker import EncoderClassifier
enc = EncoderClassifier.from_hparams(source="speechbrain/spkrec-ecapa-voxceleb", savedir="/tmp/ecapa", run_opts={"device":"cpu"})
def load(p):
    y, sr = librosa.load(p, sr=16000, mono=True)
    # trim silences (top_db 35) so similarity reflects speech
    iv = librosa.effects.split(y, top_db=35); y = np.concatenate([y[a:b] for a,b in iv]) if len(iv) else y
    return y
def emb(y):
    with torch.no_grad():
        e = enc.encode_batch(torch.tensor(y).unsqueeze(0)).squeeze().numpy()
    return e/np.linalg.norm(e)
def f0med(y):
    f0, vf, _ = librosa.pyin(y, fmin=70, fmax=300, sr=16000, frame_length=1024)
    f0 = f0[~np.isnan(f0)]
    return float(np.median(f0)) if len(f0) else float('nan')
if __name__ == '__main__':
    refs = json.loads(sys.argv[1]); cands = sys.argv[2:]
    R = {k: load(v) for k,v in refs.items()}
    RE = {k: emb(y) for k,y in R.items()}
    for k,y in R.items(): print(f'REF {k}: {len(y)/16000:.1f}s speech, F0 {f0med(y):.0f} Hz')
    ks=list(RE)
    for i in range(len(ks)):
        for j in range(i+1,len(ks)): print(f'REF-REF {ks[i]} vs {ks[j]}: {float(RE[ks[i]]@RE[ks[j]]):.3f}')
    for c in cands:
        y = load(c); e = emb(y)
        sims = {k: float(e@RE[k]) for k in RE}
        print(json.dumps({'cand': c.split('/')[-1], 'dur': round(len(y)/16000,2), 'f0': round(f0med(y)), **{f'sim_{k}': round(v,3) for k,v in sims.items()}}, ensure_ascii=False), flush=True)
