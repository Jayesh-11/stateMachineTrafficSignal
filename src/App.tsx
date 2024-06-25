import { useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const createMachine = (stateMachineDefinition: any) => {
  const machine = {
    value: stateMachineDefinition.initialValue,
    transition: (currentState: string, event: string) => {
      const currentStateDefinition = stateMachineDefinition[currentState];
      const destinationTransiton = currentStateDefinition.transitions[event];
      if (!destinationTransiton) return;

      const destinationState = destinationTransiton.target;
      const destinationStateDefinition = stateMachineDefinition[destinationState];
      destinationTransiton.action();
      currentStateDefinition.actions.onExit();
      destinationStateDefinition.actions.onEnter();

      machine.value = destinationState;
      return destinationState;
    }
  };
  return machine;
}

const useTrafficSignalStateMachine = (initialValue) => {
  const machine = useMemo(() => createMachine(initialValue), [])
  const [signal, setSignal] = useState(machine.value);
  const signalSetter = () => {
    console.log('before transition', machine, signal)
    machine.transition(signal, 'switch')
    setSignal(machine.value)

    console.log('after transition', machine, signal)
  }
  return { signal, signalSetter }

}

function App() {
  const { signal, signalSetter } = useTrafficSignalStateMachine({
    initialValue: 'red',
    green: {
      actions: {
        onEnter: () => { },
        onExit: () => { },
      },
      transitions: {
        switch: {
          target: 'red',
          action: () => { },
        }
      }
    },
    red: {
      actions: {
        onEnter: () => { },
        onExit: () => { },
      },
      transitions: {
        switch: {
          target: 'yellow',
          action: () => { },
        }
      }
    },
    yellow: {
      actions: {
        onEnter: () => { },
        onExit: () => { },
      },
      transitions: {
        switch: {
          target: 'green',
          action: () => { },
        }
      }
    }
  });
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => signalSetter()}>
          {signal}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
