// 놀이방 홈 - 각 장난감 타일에 추천 이용 연령 배지 부여. 외부 스크립트
// 순서: 그림판,분류,퍼즐,색칠,소리,붓기,숫자,그림자,선그리기,짝맞추기,코딩,한글,셈,패턴
const AGES = [1,2,3,2,1,4,3,3,3,4,5,5,5,4];
document.querySelectorAll('.toy').forEach((t,i)=>{
  const s=document.createElement('span'); s.className='age'; s.textContent=(AGES[i]||1)+'세+';
  t.appendChild(s);
});
