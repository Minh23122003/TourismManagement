import { StyleSheet } from "react-native";

export default StyleSheet.create({
    img: {
        width:200,
        height:150,
    },
    row: {
        flexDirection:"row",
        flexWrap:"wrap"
    }, text:{
        marginTop:10,
        alignItems:"center",
        fontSize:25,
        fontWeight:"bold"
    }, margin: {
        margin:5
    }, container: {
        flex:1
    }, nameTour:{
        fontSize:20,
        fontWeight:"bold",
        color:"blue"
    }, nameImage: {
        fontStyle:"italic",
        alignItems:"center"
    }, avatar: {
        width:60,
        height:60,
        borderRadius:10
    }, comment: {
        width: 250,
        backgroundColor: "lightgray",
        padding: 5
    }, button: {
        textAlign: "center",
        backgroundColor: "darkblue",
        color: "white",
        padding: 20,
        marginLeft:5
    }
})