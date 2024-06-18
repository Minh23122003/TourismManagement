export const MyUserReducer = (current, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            return null;
    }
    return current;
}

export const CartReducer = (current, action) => {
    switch (action.type) {
        case "cart":
            return action.payload;
        case "pay":
            return 0;
        case "add":
            return action.payload + 1;
        case "delete":
            return action.payload - 1;
    }
    return current;
}

export const TourReducer = (current, action) => {
    switch (action.type) {
        case "tour":
            return action.payload;
        case "add":
            return action.payload + 1;
        case "delete":
            return action.payload - 1;
    }
    return current;
}

export const NewsReducer = (current, action) => {
    switch (action.type) {
        case "news":
            return action.payload;
        case "add":
            return action.payload + 1;
        case "delete":
            return action.payload - 1;
    }
    return current;
}