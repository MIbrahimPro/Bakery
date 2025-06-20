import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {
    items: [], // { id, name, price, imageUrl, quantity }
};

const CART_STORAGE_KEY = "cart_items_v1";

function getInitialCartState() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) return { items: JSON.parse(stored) };
    } catch (e) {
        // ignore
    }
    return initialState;
}

function cartReducer(state, action) {
    console.log("Cart reducer action:", action, "Current state:", state);
    let newState;
    switch (action.type) {
        case "ADD_ITEM": {
            const existing = state.items.find((i) => i.id === action.item.id);
            if (existing) {
                newState = {
                    ...state,
                    items: state.items.map((i) =>
                        i.id === action.item.id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                };
            } else {
                newState = {
                    ...state,
                    items: [...state.items, { ...action.item, quantity: 1 }],
                };
            }
            break;
        }
        case "REMOVE_ITEM":
            newState = {
                ...state,
                items: state.items.filter((i) => i.id !== action.id),
            };
            break;
        case "INCREASE":
            newState = {
                ...state,
                items: state.items.map((i) =>
                    i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
            };
            break;
        case "DECREASE":
            newState = {
                ...state,
                items: state.items
                    .map((i) =>
                        i.id === action.id
                            ? { ...i, quantity: i.quantity - 1 }
                            : i
                    )
                    .filter((i) => i.quantity > 0),
            };
            break;
        case "CLEAR":
            newState = initialState;
            break;
        default:
            newState = state;
    }
    // Persist to localStorage
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState.items));
    } catch (e) {}
    return newState;
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(
        cartReducer,
        undefined,
        getInitialCartState
    );

    // Debug: log cart state on every render
    console.log("Cart context state:", state);

    const addToCart = (item) => dispatch({ type: "ADD_ITEM", item });
    const removeFromCart = (id) => dispatch({ type: "REMOVE_ITEM", id });
    const increaseQty = (id) => dispatch({ type: "INCREASE", id });
    const decreaseQty = (id) => dispatch({ type: "DECREASE", id });
    const clearCart = () => dispatch({ type: "CLEAR" });

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                addToCart,
                removeFromCart,
                increaseQty,
                decreaseQty,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
