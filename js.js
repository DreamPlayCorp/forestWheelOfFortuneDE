// const wheel = document.querySelector('.wheel');
// const spinButton = document.querySelector('.button');
// const popup = document.querySelector('.popup');
// const spinText = document.querySelector('.spin-text');
// function getWeightedRandom() {
//     const random = Math.random(); // случайное число от 0 до 1
//     return random < 0.7 ? false : true;
// }
//
// window.addEventListener('load', () => {
//     const storage = window.localStorage.getItem('wheel')
//     if (storage === 'spin-done') {
//         popup.classList.add('active');
//         document.querySelector('body').classList.add('blur');
//     }
//
// });
//
// let spinDeg = 0;
// let firstSpin = true;
// let randomSpin = 0;
// const spinFn = (e) => {
//     e.preventDefault();
//     if (wheel.classList.contains('spinning')) return;
//     const spinAgain = getWeightedRandom();
//     if (firstSpin) {
//         randomSpin = spinAgain ? 990 : 1080;
//     }
//     if (!firstSpin) {
//         randomSpin = spinAgain ? 1080 : 1170;
//     }
//     if (spinAgain) {
//         firstSpin = false;
//     }
//     spinDeg += randomSpin;
//     wheel.classList.add('spinning');
//     wheel.style.transition = 'transform 3s cubic-bezier(.56,-0.2,.57,1.27)';
//     wheel.style.transform = `rotate(${spinDeg}deg)`;
//     setTimeout(() => {
//         if (!spinAgain) {
//             popup.classList.add('active');
//             document.body.classList.add('blur');
//             window.localStorage.setItem('wheel', 'spin-done');
//         }
//         wheel.classList.remove('spinning');
//     }, 3100);
// };
//
//
//
// spinButton.addEventListener('click', spinFn)
// spinText.addEventListener('click', spinFn);