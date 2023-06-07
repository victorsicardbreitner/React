import ReactLogo2 from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Logo from './Logo.js';
import Clock from './Clock.js';
import Essai from './Essai.js';

const baseNames = {
  c : 'C',
  a : 'A'
}

const calculNames = {
  cal : 'Calcul',
  res : 'Resultat'
}

function retirerZerosNombreBaseC(resultBaseC){
  let newresult=resultBaseC
  let L = newresult.length
  while(newresult[L-1]===0){
    newresult.pop()
    L = newresult.length
  }
  return newresult
}

function toBaseA (numberBaseC){
  let result=0
  let num=""+numberBaseC
  let L = num.length-1
  let posPoint = num.indexOf(".")
  posPoint <0 ? posPoint = L+1 : posPoint +=0 //gérer l'absence de point

  //calcul de la partie entière
  for (let i = 0; i < posPoint; i++) {
    let n=num[posPoint-1-i]
    if(n==="A"){
      result+=10*(12**i)
    }
    else if(n==="B"){
      result+=11*(12**i)
    }
    else {
      result+=n*(12**i)
    }
  }

  //ajout de la partie fractionnaire
  for (let i = posPoint+1; i <= L; i++) {
    let n=num[i]
    let j=i-posPoint
    if(n==="A"){
      result+=10/(12**j)
    }
    else if(n==="B"){
      result+=11/(12**j)
    }
    else {
      result+=n/(12**j)
    }
  }

  
  return result
}

function toBaseC (numberBaseA){
  //let num = numberBaseA
  let result = ""
  let n = 0
  let logC = Math.log(12).toPrecision(100)
  /* while (num !== 0){
    n = num%12
    if(n===10){
      result="A"+result
    }
    else if(n===11){
      result="B"+result
    }
    else {
      result=n+result
    }
    num = (num-n)/12
  } */

  let num = numberBaseA

  //partie entière
  let l=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  let L = l.length-1
  n=Math.floor(Math.log(num).toPrecision(100)/logC)
  let k=0
  while (n>=0 && k<120) {
    num=num-12.0000000000000000000000000000000000000000000000000000**n
    l[n]=l[n]+1
    k++
    n=Math.floor(Math.log(num).toPrecision(100)/logC)
  }

  l = retirerZerosNombreBaseC(l) //retire les zéros en trop
  L = l.length-1
  let m=0
  for (let i = 0; i <= L; i++) {
    m=l[i]
    if(m===10){
      result="A"+result
    }
    else if(m===11){
      result="B"+result
    }
    else {
      result=m+result
    }
  }

  //partie fractionnaire
  result = result+"."
  l=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  L = l.length-1
  k=0
  while (n<0 && k<120) {
    num=num-12.0000000000000000000000000000000000000000000000000000**n
    l[-n]=l[-n]+1
    k++
    n=Math.floor(Math.log(num).toPrecision(100)/logC)
  }

  l=l.slice(0, 14) // problème de précision au delà de 12 (en base C) décimales
  l = retirerZerosNombreBaseC(l) // retire les zéros inutiles en décimales
  L = l.length-1
  
  
  for (let i = 1; i <= L; i++) {
    m=l[i]
    if(m===10){
      result=result+"A"
    }
    else if(m===11){
      result=result+"B"
    }
    else {
      result=result+m
    }
  }

  L = result.length-1
  result[L]=="." ? result=result.slice(0,L) : result=result
  result=="" ? result="0" : result=result
  
  return result
}

function DecoupeParenthese(calcul){
  let calcul2=calcul
  let L = calcul.length
  /*let ind = calcul.indexOf('(')
  let coco = calcul.slice(ind+1, L)
  ind = coco.indexOf(')')
  coco = coco.slice(0, ind)*/

  let j = 0
  let k = 0
  let l = [""]

  for (let i = 0; i < L; i++) {
    if(calcul[i]===')'){
      j--
      if(j==0){
        calcul2=calcul2.replace('('+l[k]+')',"XXX")
        k++
        l.push("")
      }
    }

    if(j!==0){l[k] = l[k]+calcul[i]}

    if(calcul[i]==='('){
      j++
    }
    
    
  }

  let result = calcul2 + " ====== " + l[0]
  L = l.length
  for (let i = 1; i < L; i++) {
    result = result + " ------ " + l[i]
  }

  return result
}

function Resultat (calcul){

  
  
  let result = ""
  var calcul2 = calcul

  //on coupe en deux parties
  let L = calcul2.split(/[ \(,\),+,\-,*,\/,^]+/)
  let K = calcul2.split(/[ 0,1,2,3,4,5,6,7,8,9,A,B,.]+/)

  //on épure la liste des nombres afin de les convertir proprement

  if(L[L.length-1]===""){
    L.pop();
  }
  if(L[0]===""){
    L.shift();
  }

  // on convertit

  let M = L.map(toBaseA)

  //on recolle

  let calcul3=""
  if(K[0]===""){ //on voit par quelle liste commencer à recoller
    for (let i = 0; i < M.length; i++) {
      calcul3=calcul3+M[i]+K[i+1]
    }
  }
  else{
    for (let i = 0; i < M.length; i++) {
      calcul3=calcul3+K[i]+M[i]
    }
    if(M.length < K.length && K[K.length-1]!==""){ // pour ne pas oublier le dernier caractère symbole
      calcul3=calcul3+K[K.length-1]
    }
  }
  
  /*
    for (let i = 0; i < M.length; i++) {
      calcul2=calcul2.replace(L[i],M[i])
    }
  */
  
  calcul3=calcul3.replaceAll("^","**") //calcul des puissances

  try {
    result = eval(calcul3).toString(); 
    result = toBaseC(result)
  } catch (e) {
    if (e instanceof SyntaxError) {
        result = "-------";
    }
  }


  return result;
}

function tryConvertBase (nombre, convert) {
  const value= nombre
  return convert(value).toString()
}

function tryCal (calcul, convert) {
  const value= calcul
  return convert(value).toString()
}

class NombreInput extends React.Component {

  constructor (props){
      super(props)
      this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e){
      this.props.onNombreChange(e.target.value)  //en fait en disant "onTemperatureChange={this.handleTemperatureChange}" on a dit que onTemperatureChange est une fonction, à laquelle on fait appel
  }

  render() {
      const {nombre} = this.props
      const name = 'base' + this.props.base
      const baseName = baseNames[this.props.base]
      return <div className="form-group">
          <label htmlFor={name}  className="fw-bold" >Nombre en Base {baseName}</label>
          <input type="text" id={name} value={nombre} className="form-control" onChange={this.handleChange}/>
      </div>
  }

}

class Calcul extends React.Component {

  constructor (props){
      super(props)
      this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e){
      this.props.onNombreChange(e.target.value)
  }

  render() {
      const {calcul} = this.props
      const name = 'mode' + this.props.mode
      const calculName = calculNames[this.props.mode]
      return <div className="form-group">
          <label htmlFor={name} className="fw-bold">{calculName}</label>
          <input type="text" id={name} value={calcul} className="form-control" onChange={this.handleChange}/>
      </div>
  }

}


class App extends React.Component {

  constructor (props){
      super(props)
      this.state = {nombre : Math.floor(Date.now()/1000), base : 'a', calcul : "191B59600+82B6000"}
      this.handleBaseCChange = this.handleBaseCChange.bind(this)
      this.handleBaseAChange = this.handleBaseAChange.bind(this)
      this.handleModeCal = this.handleModeCal.bind(this)
      this.handleModeRes = this.handleModeRes.bind(this)
  }

  handleBaseCChange (blabla){
    this.setState({base : 'c', nombre : blabla})
  }

  handleBaseAChange (blabla){
      this.setState({base : 'a', nombre : blabla})
  }

  handleModeCal (blabla){
    this.setState({calcul : blabla})
  }

  handleModeRes (blabla){}

  render() {
      const {nombre, base} = this.state
      const nombreBaseC = base === 'c' ? nombre : tryConvertBase(nombre, toBaseC)
      const nombreBaseA = base === 'a' ? nombre : tryConvertBase(nombre, toBaseA)

      const {calcul} = this.state
      const resultat = tryCal(calcul, Resultat)
      const date = toBaseC(Math.floor(Date.now()/1000))


      return <div class="container mt-4">
          <Timer />
          <br /><br />
          <NombreInput base="c" nombre={nombreBaseC} onNombreChange={this.handleBaseCChange}/>
          <NombreInput base="a" nombre={nombreBaseA} onNombreChange={this.handleBaseAChange} />
          <br /><br />
          <Calcul mode="cal" calcul={calcul} onNombreChange={this.handleModeCal} />
          <Calcul mode="res" calcul={resultat} onNombreChange={this.handleModeRes} />
      </div>
  }

}

export default App;


function useIncrement(initial){
  const [date, majDate] = useState(initial)
  const maj = () => {
      majDate(c => toBaseC(Math.floor(Date.now()/1000)))
  }
  return [date, maj]
}

function Timer (){
  const [date, maj] = useIncrement(toBaseC(Math.floor(Date.now()/1000)))

  useEffect( () => {
          const timer = window.setInterval(() => {
              maj()
          },1000)

          return function (){
              clearInterval(timer)
          } //nettoyer le timer quand le composant est démonté
  }, [])

  return <>
      <center>
          <Clock grandeAiguille={toBaseA(date[2])} moyenneAiguille={toBaseA(date[1])} petiteAiguille={toBaseA(date[0])} />
          <Clock grandeAiguille={toBaseA(date[5])} moyenneAiguille={toBaseA(date[4])} petiteAiguille={toBaseA(date[3])} />
          <Clock grandeAiguille={toBaseA(date[8])} moyenneAiguille={toBaseA(date[7])} petiteAiguille={toBaseA(date[6])} />
          <br />
          Date : {date.substring(0, 3) + "." + date.substring(3, 6)} Ms 
          <br /> et {date.substring(6, 9)} s
      </center>
  </>
}

function useIncremente(initial){
  const [date, majDate] = useState(initial)
  const maj = () => {
      majDate(c => c+1)
  }
  return [date, maj]
}

function Essayer (){
  const [date, maj] = useIncremente(10)

  useEffect( () => {
          const timer = window.setInterval(() => {
              maj()
          },5)

          return function (){
              clearInterval(timer)
          } //nettoyer le timer quand le composant est démonté
  }, [])

  return <>
      <center>
          <Essai compte={date%360} />
      </center>
  </>
}

/*
<img src={require('./TwelveClock.svg').default} alt='mySvgImage' />
<br />
<Logo />
*/
