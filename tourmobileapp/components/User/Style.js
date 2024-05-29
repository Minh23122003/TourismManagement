import { StyleSheet } from "react-native";

export default StyleSheet.create({
    text:{
        marginTop:10,
        alignItems:"center",
        fontSize:25,
        fontWeight:"bold"
    }, margin: {
        margin:5
    }, container: {
        flex:1
    }, avatar: {
        width: 80,
        height: 80,
        borderRadius: 20
    }, row: {
        flexDirection:"row",
        flexWrap:"wrap"
    }, booking: {
        width: 300,
        backgroundColor: "lightblue",
        padding: 5
    }, button: {
        textAlign: "center",
        backgroundColor: "blue",
        color: "white",
        padding: 2,
        marginLeft:5
    }, pay: {
        marginTop:10, 
        padding:5, 
        justifyContent:"center", 
        flexDirection:"row", 
        backgroundColor:"lightblue", 
        width:100
    }
})