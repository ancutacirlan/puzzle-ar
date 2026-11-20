/* Lungimile sunt în metri. X și Z descriu planul mesei. */
AFRAME.registerComponent('ghid', {
  init() {
    this.board = document.querySelector('#plansa');
    this.piece = document.querySelector('#piesa');
    this.outline = document.querySelector('#contur');
    this.message = document.querySelector('#mesaj');
    this.relative = new THREE.Matrix4();
    this.since = null;
    this.color = 'orange';
  },
  show(message, color = 'orange') {
    if (this.message.textContent !== message) this.message.textContent = message;
    if (this.color === color) return;
    for (const edge of ['line', 'line__b', 'line__c']) this.outline.setAttribute(edge, 'color', color);
    this.color = color;
  },
  tick(time) {
    if (!this.el.hasLoaded) return;
    const board = this.board.object3D;
    const piece = this.piece.object3D;
    if (!board.visible || !piece.visible) {
      this.since = null;
      this.show(board.visible ? 'Adu piesa în cadru. Lasă ambii markeri vizibili.' : 'Încadrează markerul Hiro de pe planșă.');
      return;
    }
    board.updateWorldMatrix(true, false);
    piece.updateWorldMatrix(true, false);
    this.relative.copy(board.matrixWorld).invert().multiply(piece.matrixWorld);
    const m = this.relative.elements;
    const distance = Math.hypot(m[12] - 0.1, m[14]);
    const angle = Math.atan2(m[2], m[0]) * 180 / Math.PI;
    if (distance > 0.008 || Math.abs(angle) > 10) {
      this.since = null;
      this.show(distance > 0.008 ? 'Mută centrul piesei spre centrul conturului.' : 'Rotește piesa până când muchiile coincid.');
      return;
    }
    if (this.since === null) this.since = time;
    if (time - this.since >= 500) this.show('Vela este așezată corect!', 'lime');
    else this.show('Ține piesa pe loc.');
  }
});
