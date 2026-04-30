import React, {
    useState,
    useEffect,
    useReducer,
    useContext,
    useCallback,
    createContext,
} from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import bg from "C:\\Users\\Riyazkhan N\\Downloads\\181a1f6e-1ffe-4831-b9c3-983d15a94f5c.jpg";

export default function RestaurantApp() {
    const [dark, setDark] = useState(false);

    return (
        <BrowserRouter>
            <AppProvider>
                <div className={dark ? "dark" : ""}>
                    <Navbar dark={dark} setDark={setDark} />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orders" element={<Orders />} />
                    </Routes>
                </div>
            </AppProvider>

            <style>{css}</style>
        </BrowserRouter>
    );
}

const AppContext = createContext();

const initialState = {
    cart: [],
    orders: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD":
            const exists = state.cart.find(
                (i) => i.name === action.payload.name
            );

            if (exists) {
                return {
                    ...state,
                    cart: state.cart.map((i) =>
                        i.name === action.payload.name
                            ? { ...i, qty: i.qty + 1 }
                            : i
                    ),
                };
            }

            return {
                ...state,
                cart: [...state.cart, { ...action.payload, qty: 1 }],
            };

        case "INC":
            return {
                ...state,
                cart: state.cart.map((i, idx) =>
                    idx === action.index ? { ...i, qty: i.qty + 1 } : i
                ),
            };

        case "DEC":
            return {
                ...state,
                cart: state.cart
                    .map((i, idx) =>
                        idx === action.index ? { ...i, qty: i.qty - 1 } : i
                    )
                    .filter((i) => i.qty > 0),
            };

        case "ORDER":
            return {
                ...state,
                orders: [...state.orders, state.cart],
                cart: [],
            };

        default:
            return state;
    }
};

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};



const Navbar = ({ dark, setDark }) => {
    const { state } = useContext(AppContext);

    return (
        <div className="nav">
            <h2>🍔 FoodieHub</h2>

            <div>
                <Link to="/">Home</Link>
                <Link to="/menu">Menu</Link>
                <Link to="/cart">Cart ({state.cart.length})</Link>
                <Link to="/orders">Orders</Link>

                <button onClick={() => setDark(!dark)}>
                    {dark ? "Light" : "Dark"}
                </button>
            </div>
        </div>
    );
};



const Home = () => (
    <div className="center">
        <h1>Welcome to FoodieHub 🔥</h1>
        <p>Order your favorite food anytime</p>
    </div>
);


const Menu = () => {
    const { dispatch } = useContext(AppContext);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const food = [
            { name: "Margherita Pizza", price: 199 },
            { name: "Cheese Burger", price: 149 },
            { name: "Veg Sandwich", price: 99 },
            { name: "Chicken Biryani", price: 249 },
            { name: "Mutton Biryani", price: 299 },
            { name: "Fried Chicken", price: 220 },
            { name: "Pasta Alfredo", price: 180 },
            { name: "Paneer Butter Masala", price: 210 },
            { name: "Chicken 65", price: 180 },
            { name: "Egg Fried Rice", price: 120 },
            { name: "Veg Fried Rice", price: 110 },
            { name: "Chicken Fried Rice", price: 160 },
            { name: "Ice Cream", price: 80 },
            { name: "Brownie", price: 150 },
        ];

        setItems(food);
    }, []);

    const add = useCallback(
        (item) => dispatch({ type: "ADD", payload: item }),
        [dispatch]
    );

    const filtered = items.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <h1>Menu</h1>

            <input
                className="search"
                placeholder="Search food..."
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid">
                {filtered.map((item, i) => (
                    <div className="card" key={i}>
                        <h4>{item.name}</h4>
                        <p>₹{item.price}</p>
                        <button onClick={() => add(item)}>Add</button>
                    </div>
                ))}
            </div>
        </div>
    );
};



const Cart = () => {
    const { state, dispatch } = useContext(AppContext);

    const total = state.cart.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
    );

    return (
        <div className="container">
            <h2>Your Cart</h2>

            {state.cart.length === 0 && <p>Cart is empty</p>}

            {state.cart.map((item, i) => (
                <div className="cartItem" key={i}>
                    <span>{item.name}</span>

                    <div>
                        <button onClick={() => dispatch({ type: "DEC", index: i })}>
                            -
                        </button>
                        <span> {item.qty} </span>
                        <button onClick={() => dispatch({ type: "INC", index: i })}>
                            +
                        </button>
                    </div>

                    <span>₹{item.price * item.qty}</span>
                </div>
            ))}

            <h3>Total: ₹{total}</h3>

            {state.cart.length > 0 && (
                <button
                    className="orderBtn"
                    onClick={() => dispatch({ type: "ORDER" })}
                >
                    Place Order
                </button>
            )}
        </div>
    );
};



const Orders = () => {
    const { state } = useContext(AppContext);

    return (
        <div className="container">
            <h2>Order History</h2>

            {state.orders.length === 0 ? (
                <p>No orders yet</p>
            ) : (
                state.orders.map((order, i) => (
                    <div className="card" key={i}>
                        Order {i + 1} - {order.length} items
                    </div>
                ))
            )}
        </div>
    );
};







const css = `


body {
  margin: 0;
  font-family: Arial;
  background: #f4f4f4;
  background-image: url(${bg});
  background-size: cover;
  background-position: center;

  
}

.dark {
  background: #121212;
  color: white;
  min-height: 100vh;
  background-size: cover;
}

.nav {
 position: fixed;      
  top: 0;
  left: 0;
  width: 100%;        
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(172, 172, 172, 0.97);
  color: white;
  z-index: 1000;          
  box-sizing: border-box;
}

.nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}

.container {
   padding: 20px;
   margin: 50px 20px 20px 20px;  
}

.center {
  height: 100vh;            
  display: flex;
  justify-content: center;    
  align-items: center;        
  flex-direction: column;    
  text-align: center;
  
}

.center p {
  color: #f1f1f1;
}
.center h1 {
  color: #f1f1f1;
  
  
}
  .container p {

  color: #f1f1f1;
  
}
.container h1 {

  color: #f1f1f1;
  
}
.container h2 {

  color: #f1f1f1;
  
}
  .container h3 {

  color: #f1f1f1;
  
}
.search {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
}

.card {
  background: white;
  color: black;
  padding: 15px;
  border-radius: 10px;
}
.orderBtn button{
  padding: 8px 12px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}
    
.card button{
  padding: 8px 12px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}
button:hover {
  background: #e63939;  
  transform: scale(1.05);
}

  button:active {
  background: #2eee0c;   
  transform: scale(0.95); 
}

.dark .card {
  background: #1e1e1e;
  color: white;
  background-size: cover;
}
.card p {
  font-weight: bold;
  font-size: 16px;
  color: #333;  
  background-size: cover;
}

.dark .card p {
  color: #f1f1f1; 
}
.cartItem {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  margin: 10px 0;
  border-radius: 8px;
}

.dark .cartItem {
  background: #1e1e1e;
}

button {
  padding: 8px 12px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.orderBtn {
  width: 100%;
  margin-top: 10px;
}

`;