import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestContext = createContext();

const TestProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [testId, setTestId] = useState(null);
    const navigate = useNavigate();
    useEffect(()=>{
        const userInfo=  JSON.parse(localStorage.getItem("userinfo"))
        setUser(userInfo)
        
      },[navigate])
   
    return (
        <TestContext.Provider value={{ user, testId, setTestId }}>
            {children}
        </TestContext.Provider>
    );
};

export const Teststate = () => useContext(TestContext);

export default TestProvider;
