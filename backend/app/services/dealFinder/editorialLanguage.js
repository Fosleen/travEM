// Numeric months are understood across the blog's regional audience.
const months=[['siječanj','siječnja','siječnju','siječnjem'],['veljača','veljače','veljači','veljaču','veljačom'],['ožujak','ožujka','ožujku','ožujkom'],['travanj','travnja','travnju','travnjem'],['svibanj','svibnja','svibnju','svibnjem'],['lipanj','lipnja','lipnju','lipnjem'],['srpanj','srpnja','srpnju','srpnjem'],['kolovoz','kolovoza','kolovozu','kolovozom'],['rujan','rujna','rujnu','rujnom'],['listopad','listopada','listopadu','listopadom'],['studeni','studenog','studenoga','studenom'],['prosinac','prosinca','prosincu','prosincem']];
export function editorialLanguage(value){
 let text=String(value||'').normalize('NFC').replace(/Velik(?:a|e|oj|u|om) Goric(?:a|e|i|u|om)/gi,'Zagreb');
 months.forEach((forms,index)=>{text=text.replace(new RegExp(`(?<![\\p{L}])(?:${forms.join('|')})(?![\\p{L}])`,'giu'),word=>{
  const form=word.toLowerCase();const ending=form===forms[0]||form==='veljaču'?'mjesec':/(om|em)$/.test(form)?'mjesecom':/[ui]$/.test(form)?'mjesecu':'mjeseca';
  return `${index+1}. ${ending}`;
 });});
 return text.replace(/iz Zagreb(?![\p{L}])/giu,'iz Zagreba').replace(/u Zagreb(?![\p{L}])/giu,'u Zagrebu');
}
