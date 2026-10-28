// Read actual painted text bounds, not only the document's scroll width.
export async function inspectControlGeometry(page) {
  return page.evaluate(() => {
    const issues=[];
    for(const el of document.querySelectorAll('button,a[href],[role="button"]')) {
      const box=el.getBoundingClientRect(), css=getComputedStyle(el);
      if(box.width<1||box.height<1||box.right<0||box.left>innerWidth||css.visibility==='hidden'||el.closest('[aria-hidden="true"]'))continue;
      let visible=true;
      for(let p=el;p;p=p.parentElement)if(Number(getComputedStyle(p).opacity)<.9||getComputedStyle(p).display==='none'){visible=false;break;}
      if(!visible)continue;
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
      let node;const overflowing=[];
      while(node=walker.nextNode()) {
        if(!node.textContent.trim()||node.parentElement.closest('svg,[aria-hidden="true"],[role="tooltip"],.sr-only'))continue;
        const style=getComputedStyle(node.parentElement);
        if(style.visibility==='hidden'||style.display==='none'||style.textOverflow==='ellipsis')continue;
        const range=document.createRange();range.selectNodeContents(node);
        for(const rect of range.getClientRects())if(rect.width>0&&rect.height>0&&(rect.left<box.left-2||rect.right>box.right+2||rect.top<box.top-2||rect.bottom>box.bottom+2))overflowing.push(node.textContent.trim());
      }
      if(overflowing.length)issues.push({tag:el.tagName,text:[...new Set(overflowing)].join(' ').slice(0,100),label:el.getAttribute('aria-label'),className:el.className,width:Math.round(box.width),height:Math.round(box.height)});
    }
    return issues;
  });
}
