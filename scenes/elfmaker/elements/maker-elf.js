import {html, svg, LitElement} from '@polymer/lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';



const hats = [
  '',
  svg`
<circle class="white" cx="105" cy="57.59" r="14.84"/>
<polygon class="suit" points="147.65 157.59 105 72.43 62.35 157.59 147.65 157.59"/>
<path class="white" d="M145.71,178.2a12.5,12.5,0,0,1-11.92-8.78,30.17,30.17,0,0,0-57.57,0A12.5,12.5,0,0,1,52.36,162a55.17,55.17,0,0,1,105.29,0,12.53,12.53,0,0,1-11.94,16.24Z"/>
`,
svg`
<g transform="translate(0, 6)">
  <path class="hats-dark" d="M138.8,146.14c0-27.58-16-43.69-33.8-43.69s-33.8,16.11-33.8,43.69Z"/>
  <circle class="white" cx="105" cy="87.61" r="14.84"/>
  <ellipse class="hats" cx="105" cy="165.92" rx="70.33" ry="55.17"/>
</g>
  `,
];



function interpolateAngle(start, c1, c2, end) {
	return (t) => {
    const tangentX =
      (3 * Math.pow(1 - t, 2) * (c1.x - start.x)) +
      (6 * (1 - t) * t * (c2.x - c1.x)) +
      (3 * Math.pow(t, 2) * (end.x - c2.x));
    const tangentY =
      (3 * Math.pow(1 - t, 2) * (c1.y - start.y)) +
      (6 * (1 - t) * t * (c2.y - c1.y)) +
      (3 * Math.pow(t, 2) * (end.y - c2.y));
    return Math.atan2(tangentY, tangentX) * (180 / Math.PI);
  }
}


export class MakerElfElement extends LitElement {
  static get properties() {
    return {
      suitColor: {type: String},
      hatsColor: {type: String},
      skinTone: {type: String},
      _offset: {type: Number},
    };
  }

  constructor() {
    super();
    this._offset = 0;
  }

  _buildArm(angle=0, shrug=1, length=120) {
    const rads = (angle / 180) * Math.PI;
    const offset = {x: Math.sin(rads) * length, y: Math.cos(rads) * length};

    const bodyControl = {x: shrug * -50, y: 0};  // 40.51 goes away from start arm
    const handControl = {x: -81.2, y: 29.27};

    const interpolate = interpolateAngle(
      {x: 0, y: 0},
      bodyControl,
      handControl,
      {x: -offset.x, y: offset.y},
    );
    const angleAt = interpolate(1) - 90;

    return svg`
<path class="limb" d="M0,0c${bodyControl.x},${bodyControl.y},${handControl.x},${handControl.y},${-offset.x},${offset.y}"/>
<g transform="translate(${-offset.x}, ${offset.y}) rotate(${angleAt})">
  <circle class="skin" cx="0" cy="0" r="21.32"/>
  <path transform="translate(-48.8, -303.89)" class="white" d="M66.87,272.56H30.73a10,10,0,0,0,0,20H66.87a10,10,0,0,0,0-20Z"/>
</g>
    `;
  }

  _updateArmAngle() {
    this._offset = (performance.now() / 1000);
  }

  connectedCallback() {
    const run = () => {
      if (!this.isConnected) {
        return;
      }
      window.requestAnimationFrame(run);
      this._updateArmAngle();
    };
    run();
  }

  render() {
    const rightArmDegrees = 100 + (50 * Math.cos(this._offset / 0.8));
    const leftArmDegrees = 135 + (10 * Math.sin(this._offset * 1.5));
    const shrug = (Math.cos(this._offset) + 1) / 2;
    const bodyDegrees = (Math.cos(this._offset) * 0.5) * 10;

    return html`
    <style>
    svg {
      width: 280px;
    }
    </style>

    <svg viewBox="-30 0 320 428.64" style="filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.125))">
      <defs>
        <style>
.suit {fill: ${this.suitColor || 'red'};}
.hats {fill: ${this.hatsColor || 'red'}}
.limb {
  fill: none;
  stroke: ${this.suitColor || 'red'};
  stroke-linecap: round;
  stroke-miterlimit: 10;
  stroke-width: 20px;
}
.high1 {fill: #332e2e;}
.eyes {fill: #332e2e;}
.high2 {fill: #f9ce1d;}
.white {fill: #fff;}
.skin {fill: ${this.skinTone};};
        </style>
      </defs>

      <g>
        <g transform="translate(130, 0) rotate(${bodyDegrees}, 0, 280)">
          <g transform="translate(-105, -25)">
            ${hats[2]}
          </g>

          <!-- head -->
          <g transform="translate(-105, -18)">
            <path class="skin" d="M161.48,148.65l-21.81,21.8a11.29,11.29,0,1,0,16,16C169.25,172.79,161.48,148.65,161.48,148.65Z"/>
            <path class="skin" d="M70.33,170.45l-21.81-21.8s-7.77,24.14,5.85,37.76a11.29,11.29,0,1,0,16-16Z"/>
            <circle class="skin" cx="105" cy="178.43" r="42.65"/>
            <path class="eyes" d="M96.39,166.2a8.62,8.62,0,1,1-8.62-8.61A8.63,8.63,0,0,1,96.39,166.2Z"/>
            <path class="white" d="M130.85,183.43a25.85,25.85,0,1,1-51.69,0Z"/>
            <path class="eyes" d="M130.85,166.2a8.62,8.62,0,1,1-8.62-8.61A8.63,8.63,0,0,1,130.85,166.2Z"/>
          </g>

          <!-- body -->
          <path transform="translate(-130, 0)" class="suit" d="M130,202.7a42.66,42.66,0,0,0-42.65,42.65v35.74a42.65,42.65,0,1,0,85.3,0V245.35A42.66,42.66,0,0,0,130,202.7Z"/>

          <!-- belt -->
          <rect class="high1" x="-42.65" y="259.76" width="85.3" height="21.32"/>
          <rect class="high2" x="-10.66" y="258.76" width="21.32" height="23.32"/>
  
          <!-- left arm -->
          <g transform="translate(-10, 216) scale(1, -1)">
            ${this._buildArm(leftArmDegrees, shrug)}
          </g>

          <!-- right arm -->
          <g transform="translate(+10, 216) scale(-1, -1)">
            ${this._buildArm(rightArmDegrees, shrug)}
          </g>
        </g>

        <!-- legs -->
        <path class="limb" d="M112.51,301.25v78.69"/>
        <path class="limb" d="M147.49,301.25v78.69"/>

        <!-- feet and buckles -->
        <path class="high1" d="M68.15,389.94a19.36,19.36,0,0,0,19.36,19.35h0a15,15,0,0,0,15-15V379.94h20v43.7a5,5,0,0,1-5,5H68.62c-10.5,0-19.43-8.16-19.81-18.65A19.35,19.35,0,0,1,68.15,389.94Z"/>
        <path class="high2" d="M102.51,399.29H110a5,5,0,0,0,0-10h-7.51a5,5,0,1,0,0,10Z"/>
        <path class="high1" d="M191.85,389.94a19.36,19.36,0,0,1-19.36,19.35h0a15,15,0,0,1-15-15V379.94h-20v43.7a5,5,0,0,0,5,5h48.89c10.5,0,19.43-8.16,19.81-18.65A19.35,19.35,0,0,0,191.85,389.94Z"/>
        <path class="high2" d="M157.49,399.29H150a5,5,0,1,1,0-10h7.51a5,5,0,0,1,0,10Z"/>
      </g>
    </svg>
    `;
  }

}

customElements.define('maker-elf', MakerElfElement);