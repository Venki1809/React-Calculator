import { useReducer } from 'react'
import './style.css'
import Digit from './digit'
import Operation from './operation'

export const ACTIONS={
  ADD_DIGIT:'add-digit',
  CHOOSE_OPERATION:'choose-operation',
  CLEAR:"clear",
  DELETE_DIGIT:'delete-digit',
  EVALUATE:'evaluate'
}

function reducer(state ,{type,payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
    if(state.overwrite){
      return{
      ...state,
      curOpereand: payload.digit,
      overwrite: false
    }}
    if (payload.digit==="0" && state.curOpereand==="0") return state
    if (payload.digit==="." && state.curOpereand.includes(".")) return state
    return {
      ...state,
      curOpereand: `${state.curOpereand || ""}${payload.digit}`,
     }
     case ACTIONS.CLEAR:
      return {}
     case ACTIONS.CHOOSE_OPERATION:
      if(state.curOpereand==null && state.prevoperand==null){
        return state
      }

      if(state.curOpereand==null){
        return{
          ...state,
          operation:payload.operation,
        }
      }
       if(state.prevoperand==null){
        return{
          ...state,
          operation:payload.operation,
          prevoperand:state.curOpereand,
          curOpereand:null,
        }
      }
      return{
        ...state,
        prevoperand:evaluate(state),
        operation:payload.operation,
        curOpereand:null
      }
    case ACTIONS.EVALUATE:
      if(state.operation==null ||state.curOpereand==null ||state.prevoperand==null)
      {
        return state
      }
     
      return {
        ...state,
        overwrite:true,
        prevoperand:null,
        operation:null,
        curOpereand:evaluate(state)
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          overewrite:false,
          curOpereand:null
         
      }
    }
    if(state.curOpereand==null) return state
    if(state.curOpereand.length===1){
      return{...state,curOpereand:null}
    }
    return{
      ...state,
      curOpereand:state.curOpereand.slice(0,-1)
    }
  }
}
function evaluate({curOpereand,prevoperand,operation})
{
  const prev=parseFloat(prevoperand)
  const curr=parseFloat(curOpereand)
if(isNaN(prev) ||isNaN(curr)) return ""
let computation=""
switch(operation){
  case '*': computation=prev*curr;
            break;
  case '+': computation=prev+curr;
            break;
  case '-': computation=prev-curr;
            break;
  case '/': computation=prev/curr;
            break;

}

return computation.toString()
}

const INTEGER_FORMATOR=new Intl.NumberFormat("en-us",{maximumFractionDigits:0,})

function formatop(operand){
  if(operand==null) return
   const [integer,decimal]=operand.split('.')
  if (decimal ==null) return INTEGER_FORMATOR.format(integer)
  return `${INTEGER_FORMATOR.format(integer)}.${decimal}`

}
function App() {
  const [{curOpereand,prevoperand,operation},dispatch] = useReducer(reducer,{})
 

  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>{formatop(prevoperand)}{operation}</div>
        <div className='current-operand'>{formatop(curOpereand)}</div>
      </div>
      <button className='span-two' onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <Operation operation="/" dispatch={dispatch}/>
      <Digit digit="1" dispatch={dispatch}/>
      <Digit digit="2" dispatch={dispatch}/>
      <Digit digit="3" dispatch={dispatch}/>
      <Operation operation="*" dispatch={dispatch}/>
      <Digit digit="4" dispatch={dispatch}/>
      <Digit digit="5" dispatch={dispatch}/>
      <Digit digit="6" dispatch={dispatch}/>
      <Operation operation="-" dispatch={dispatch}/>
      <Digit digit="7" dispatch={dispatch}/>
      <Digit digit="8" dispatch={dispatch}/>
      <Digit digit="9" dispatch={dispatch}/>
      <Operation operation="+" dispatch={dispatch}/>
      <Digit digit="." dispatch={dispatch}/>
      <Digit digit="0" dispatch={dispatch}/>
      <button className='span-two' onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>


    </div>
  )
}

export default App;
