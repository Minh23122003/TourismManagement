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
    }, title:{
        fontSize:20,
        fontWeight:"bold",
        color:"blue",
        alignItems:"center",
    }, nameImage: {
        fontStyle:"italic",
        alignItems:"center"
    }
})