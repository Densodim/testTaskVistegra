import './App.css'
import InputForm from "./components/InputForm/InputForm.tsx";
import Results from "./components/Results/Results.tsx";

function App() {

    return (
        <>
            <div className='app'>
                <div className='container'>
                    <div className='inputForm'>
                        <InputForm/>
                    </div>
                    <div className='results'>
                        <Results/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
