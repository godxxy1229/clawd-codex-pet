// Static SVG frames -> transparent API PNG and Codex Pets website WebP.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = __dirname;
const W = 192, H = 208;
const metadata = require('./animation.json');
const rows = metadata.rows;
async function frame(state, filename) {
  // Mirror rendered rightward cells to preserve their antialiasing exactly.
  const source = state === 'running-left' ? 'running-right' : state;
  let image = sharp(path.join(root, 'svg', source, filename + '.svg'));
  if (state === 'running-left') image = image.flop();
  const png = await image.png().toBuffer();
  // Match the original direction-strip renderer's alpha compositing.
  if (state.startsWith('look')) return sharp({create:{width:W,height:H,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:png,left:0,top:0}]).png().toBuffer();
  return png;
}
async function main() {
  const out = path.join(root, 'build'); fs.mkdirSync(out, {recursive:true});
  const cells = [];
  for (const row of rows) {
    for (let i=0; i<row.frames; i++) cells.push({input:await frame(row.state,String(i).padStart(2,'0')),left:i*W,top:row.row*H});
  }
  for (let i=0; i<16; i++) {
    const [dx,dy] = metadata.look_registration_offsets_px[i];
    cells.push({input:await frame(i<8?'look9':'look10',String(i*22.5).padStart(2,'0')),left:(i%8)*W,top:(9+Math.floor(i/8))*H,dx,dy,look:true});
  }
  const atlas = Buffer.alloc(1536*2288*4);
  async function paste(cell) {
    const rgba = await sharp(cell.input).ensureAlpha().raw().toBuffer();
    // Direction extraction in the approved pipeline uses alpha > 16 components.
    if(cell.look) for(let i=0;i<rgba.length;i+=4) if(rgba[i+3]<=16) rgba.fill(0,i,i+4);
    for(let y=0;y<H;y++) for(let x=0;x<W;x++) {
      const dx=x+(cell.dx||0),dy=y+(cell.dy||0);
      if(dx>=0&&dx<W&&dy>=0&&dy<H) rgba.copy(atlas,((cell.top+dy)*1536+cell.left+dx)*4,(y*W+x)*4,(y*W+x+1)*4);
    }
  }
  for(const cell of cells) await paste(cell);
  // Clear hidden colors in fully transparent pixels, matching the validated atlas.
  for(let i=0;i<atlas.length;i+=4) if(atlas[i+3]===0) atlas.fill(0,i,i+3);
  const raw = {width:1536,height:2288,channels:4};
  await sharp(atlas,{raw}).png().toFile(path.join(out,'spritesheet.png'));
  // The community website has a dedicated neutral look cell at row 0, column 6.
  const neutral = await frame('idle','00');
  await paste({input:neutral,left:6*W,top:0});
  await sharp(atlas,{raw}).webp({lossless:true,effort:6}).toFile(path.join(out,'spritesheet.webp'));
  fs.copyFileSync(path.join(root,'package/pet.json'),path.join(out,'pet.json'));
  console.log('Built API PNG and website package in build/.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
