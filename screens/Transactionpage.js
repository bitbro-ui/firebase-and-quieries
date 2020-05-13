import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity,Image,TextInput, Alert,KeyboardAvoidingView,ToastAndroid} from 'react-native';
import  * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner'; 
import firebase from 'firebase';
import db from '../config'
export default class Transactionscreen extends React.Component{
    constructor(){
        super();
        this.state = {
            hascamerapermission:null,
            scanned:false,
            scandata:'',
            buttonstate : 'normal',
            scannedstudentid:'',
            scannedbookid:''
        }
    }
    
    getcamerapermission = async(id)=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hascamerapermission:status === "granted",
            buttonstate:id,scanned:false
        })
    } 

    handlebarcodescan = async({type,data})=>{
        const {buttonstate}=this.state
        if(buttonstate==="book id"){
        this.setState({
            scanned:true,scannedbookid:data,buttonstate:'normal'
        })
        }
        else if(buttonstate==="student id"){
        this.setState({
                scanned:true,scannedstudentid:data,buttonstate:'normal' 
        }
        )}}
        handleTransaction =()=>{
            var Transactionmessage 
            db.collection("books").doc(this.state.scannedbookid).get().then((doc)=>{
                var book = doc.data()
                if(book.bookavailability){
                    this.initiatebookissue();
                    Transactionmessage = "book issued"
                    ToastAndroid.show(Transactionmessage,ToastAndroid.SHORT)
                }             
                else{
                    this.bookreturn();
                    Transactionmessage="book returned"
                    ToastAndroid.show(Transactionmessage,ToastAndroid.SHORT)
                }
            })            
            this.setState({Transactionmessage:Transactionmessage})
        }
        initiatebookissue=async()=>{
            db.collection("transaction").add({
                'studentid':this.state.scannedstudentid,
                'bookid':this.state.scannedbookid,
                'date':firebase.firestore.Timestamp.now().toDate(),
                'transactiontype':"issue"
            })
            db.collection("books").doc(this.state.scannedbookid).update({
                'bookavailability':false
            })
            db.collection("studentid").doc(this.state.scannedstudentid).update({
                'numberofbooksissued':firebase.firestore.FieldValue.increment(1)
            })
        Alert.alert("book issued")
        this.setState({scannedbookid:'',scannedstudentid:''})
        }
        bookreturn=async()=>{
            db.collection("transaction").add({
                'studentid':this.state.scannedstudentid,
                'bookid':this.state.scannedbookid,
                'date':firebase.firestore.Timestamp.now().toDate(),
                'transactiontype':"return"
            })
            db.collection("books").doc(this.state.scannedbookid).update({
                'bookavailability':true
            })
            db.collection("studentid").doc(this.state.scannedstudentid).update({
                'numberofbooksissued':firebase.firestore.FieldValue.increment(-1)
            })
        Alert.alert("book returned")
        this.setState({scannedbookid:'',scannedstudentid:''})
        }
        
        render(){
        const hascamerapermission = this.state.hascamerapermission;
        const scanned = this.state.scanned;
        const buttonstate = this.state.buttonstate;
        if (buttonstate!=="normal" && hascamerapermission){
            return(
                <BarCodeScanner onBarCodeScanned = {scanned?undefined:this.handlebarcodescan}
                style = {StyleSheet.absoluteFillObject}/>
            )
        }

        else if(buttonstate==="normal"){
            return(
                <KeyboardAvoidingView style={styles.container}behaviour="padding"enabled>
                <View>
                <Image source={require("../assets/booklogo.jpg")}
                style={{width:200,height:200}}/>
                <Text style={{textAlign:'center',fontSize:30}}>willi</Text>
                <View style ={styles.inputView}>
                    <TextInput style ={styles.inputbox}
                    placeholder="book id"
                    onChangeText={text =>this.setState({scannedbookid:text})}
                    value={this.state.scannedbookid}/>
                    <TouchableOpacity style={styles.scanButton}
                    onPress={()=>{
                        this.getcamerapermission("book id")
                    }}
                    >
                        <Text style ={styles.buttonText}>scan</Text></TouchableOpacity>
                </View>
                <View style={styles.inputView}>
                <TextInput style ={styles.inputbox}
                placeholder="student id"
                onChangeText={text =>this.setState({scannedstudentid:text})}
                value={this.state.scannedstudentid}/>
                <TouchableOpacity style={styles.scanButton}
                onPress={()=>{this.getcamerapermission("student id")}}>
                <Text style ={styles.buttonText}>scan</Text></TouchableOpacity></View>
                </View>
                <Text style ={styles.displayText}>{hascamerapermission===true?this.state.scandata:"request camera permission"}</Text>
                <TouchableOpacity 
                onPress={this.getcamerapermission}
                style ={styles.scanButton}>
                <Text style ={styles.buttonText}>scan the QR code to run the app</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style = {styles.submitbutton}
                onPress={async()=>{this.handleTransaction();
                this.setState({
                    scannedbookid:'',
                    scannedstudentid:''
                    })}}>
                <Text style ={styles.submittext}>SUBMIT</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        )
        }
}
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:"center"
    },
    displayText:{
        fontSize:10,
        textDecorationLine:'underline'
    },
    scanButton:{
        backgroundColor:"black",
        width:200,
        marginBottom: 20
    },
    buttonText:{
        
        fontSize:30,       
    },
    inputView:{
        flexDirection:'row',
        margin:20 
    },
    inputbox:{
        width:200,
        height:100,
        borderWidth:3,
        fontSize:20
    },
    submitbutton:{
        backgroundColor:'white',
        width:80,
        height:50
    },
    submittext:{
        fontSize:14,
        color:'blue'
    }
})



