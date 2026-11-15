"use client";
import {useEffect,useRef,useState} from 'react';
import {AirplaneTilt,ArrowRight,Check,Plus} from '@phosphor-icons/react';
import {articlePollApi} from '@/utils/articlePollApi';
import './ArticleDestinationPoll.scss';
type Option={key:string,label:string,percentage?:number,selected?:boolean};
type Poll={question:string,hasVoted:boolean,totalVotes:number,formToken:string,options:Option[]};
export default function ArticleDestinationPoll({articleId}:{articleId:number}){
  const [poll,setPoll]=useState<Poll|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const [suggesting,setSuggesting]=useState(false),[suggestion,setSuggestion]=useState(''),[website,setWebsite]=useState('');
  const [revealed,setRevealed]=useState(false);
  const received=useRef(0),current=useRef(articleId);
  useEffect(()=>{let cancelled=false;current.current=articleId;
    articlePollApi(`${articleId}/destination-poll`).then(data=>{if(!cancelled){received.current=Date.now();setPoll(data);}}).catch(()=>{if(!cancelled)setPoll(null);});
    return()=>{cancelled=true;current.current=0;};
  },[articleId]);
  useEffect(()=>{
    if(!poll?.hasVoted)return;
    let second=0;
    const first=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>setRevealed(true));});
    return()=>{cancelAnimationFrame(first);cancelAnimationFrame(second);};
  },[poll?.hasVoted]);
  async function vote(optionKey?:string){
    if(!poll||poll.hasVoted||busy)return;setBusy(true);setError('');
    try{
      await new Promise(resolve=>setTimeout(resolve,Math.max(0,2100-(Date.now()-received.current))));
      const result=await articlePollApi(`${articleId}/destination-poll/vote`,{formToken:poll.formToken,website,...(optionKey?{optionKey}:{suggestion:suggestion.trim()})});
      if(current.current===articleId){setPoll(result);setSuggesting(false);}
    }catch(e){if(current.current===articleId)setError(e instanceof Error?e.message:'Glas nije spremljen. Pokušaj ponovno.');}
    finally{if(current.current===articleId)setBusy(false);}
  }
  if(!poll)return null;
  return <section className="article-destination-poll" aria-labelledby={`destination-poll-${articleId}`} aria-busy={busy}>
    <div className="destination-poll-eyebrow"><AirplaneTilt size={20} weight="fill"/><span>TI BIRAŠ SLJEDEĆU PONUDU</span></div>
    <h3 id={`destination-poll-${articleId}`}>{poll.question}</h3><p>Kamo bi putovao/la? Glasaj pa pogledaj što zanima ostale.</p>
    <div className="destination-poll-options">{poll.options.map(option=><button key={option.key} type="button" className={`destination-poll-option${option.selected?' is-selected':''}`} disabled={busy||poll.hasVoted} onClick={()=>void vote(option.key)} aria-label={poll.hasVoted?`${option.label}: ${option.percentage||0}%`:option.label}>
      <span className="destination-poll-fill" aria-hidden="true" style={{width:revealed?`${option.percentage||0}%`:'0%'}}/><span className="destination-poll-label">{option.label}{option.selected&&<Check size={18} weight="bold" aria-label="Tvoj odabir"/>}</span>{poll.hasVoted&&<strong>{option.percentage||0}%</strong>}
    </button>)}
    {!poll.hasVoted&&poll.options.length<10&&(!suggesting?<button type="button" className="destination-poll-option destination-poll-add" disabled={busy} onClick={()=>setSuggesting(true)}><span className="destination-poll-label">Predloži drugo odredište</span><Plus size={21}/></button>:<form className="destination-poll-option destination-poll-custom" onSubmit={e=>{e.preventDefault();void vote();}}><Plus size={20} aria-hidden="true"/><label className="destination-poll-input-label" htmlFor={`poll-suggestion-${articleId}`}>Tvoj prijedlog destinacije</label><input id={`poll-suggestion-${articleId}`} autoFocus maxLength={60} minLength={2} required placeholder="Upiši svoje odredište…" value={suggestion} disabled={busy} onChange={e=>setSuggestion(e.target.value)} onKeyDown={e=>{if(e.key==='Escape')setSuggesting(false);}}/><button type="submit" aria-label="Predloži destinaciju i glasaj" title="Predloži i glasaj" disabled={busy||suggestion.trim().length<2}><ArrowRight size={20} weight="bold"/></button></form>)}
    </div>
    {suggesting&&!poll.hasVoted&&<p className="destination-poll-custom-hint">Tvoj prijedlog ujedno računa glas. Pritisni Enter ili strelicu za potvrdu.</p>}
    <div className="destination-poll-honeypot" aria-hidden="true"><label>Web stranica<input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label></div>
    <div className="destination-poll-footer" role="status">{busy?'Spremam tvoj glas…':poll.hasVoted?'Hvala! Tvoj glas pomaže nam odabrati sljedeće ponude.':poll.totalVotes?`${poll.totalVotes} glasova dosad`:'Budi prvi/a i odaberi odredište.'}{poll.hasVoted&&<span>{poll.totalVotes} glasova</span>}</div>
    {error&&<p className="destination-poll-error" role="alert">{error}</p>}
  </section>;
}
