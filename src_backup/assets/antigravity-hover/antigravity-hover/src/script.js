class LettersClass {
  
  constructor(word) {
    
    this.word = word;
    this.letters;

    this.word.addEventListener('mouseover', this.overEvent.bind(this));
    this.word.addEventListener('mouseout', this.outEvent.bind(this));

    this.splitWord(this.word);
    
  }
  
  word() {
    return this.word;
  }
  
  overEvent(event) {
    
    this.updateProps();
    
  }
  
  outEvent(event) {
    
    for(var i = 0; i < this.letters.length; i++) {
      this.letters[i].setAttribute('style', 'transform: translateY(0px)');
    }
    
  }

  splitWord(word) {

    var letters = word.innerText.split('');
    word.innerHTML = "";
    for(var i = 0; i < letters.length; i++){
      word.innerHTML += `<span>${letters[i]}</span>`
    }
        
    this.letters = word.querySelectorAll('span');
    
  }
  
  updateProps() {
    for(var i = 0; i < this.letters.length; i++) {
     
let scale = this.randomScale();      
      this.letters[i].setAttribute('style', `
transform: translateY(-${ this.randomHeight() }px) 
rotateY(${ this.randomRotation() }deg) 
rotateX(${ this.randomRotation() }deg) 
rotateZ(${ this.randomRotation() }deg)
scale(${scale});
opacity: ${scale};`);     
    }
  }

  randomHeight() {
    return Math.floor(Math.random() * 100) + 100;
  }

  randomRotation() {
    return Math.floor(Math.random() * 120) - 60;
  }

  randomScale() {
    return (Math.floor(Math.random() * 100)/100) + 0.5;
  }
}

var letters = new LettersClass(document.querySelector('.word'));
