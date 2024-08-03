'use client'
import Image from "next/image";
import {useState, useEffect} from "react";
import {firestore} from "@/firebase"
import {Box, Modal, Typography, Stack, TextField, Button} from "@mui/material";
import {collection, deleteDoc, getDocs, query, doc, setDoc, getDoc} from "firebase/firestore";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme'; // Adjust the path to where theme.js is located


export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()

    if (searchResult && searchResult.name === item) {
      setSearchResult((prev) => ({ ...prev, quantity: prev.quantity + 1 }))
    }
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity == 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()

    if (searchResult && searchResult.name === item) {
      setSearchResult((prev) => ({ ...prev, quantity: prev.quantity - 1 }))
    }
  }

  const handleSearch = async () => {
    const docRef = doc(collection(firestore, 'inventory'), searchTerm)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setSearchResult({ name: searchTerm, ...docSnap.data() });
    } else {
      setSearchResult(null);
    }
    setSearchOpen(true);
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleSearchClose = () => setSearchOpen(false)

  return (
    <ThemeProvider theme={theme}>
    <Box width="100vw"
         height="100vh" 
         display="flex" 
         flexDirection="column"
         justifyContent="center" 
         alignItems="center"
         gap={2}
         bgcolor={theme.palette.background.default}
    >
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" 
             top="50%" 
             left="50%" 
             width={400}
             bgcolor="white"
             border="2px solid #0000"
             boxShadow={24}
             p={4}
             display="flex"
             flexDirection="column"
             gap={3}
             sx={{
              transform: 'translate(-50%, -50%)',
             }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}

            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              sx={{
                fontWeight: 700, // Make text bold
                fontSize: '1.1rem', // Adjust font size as needed
                color: 'black', // Change text color to black
                borderColor: 'black', // Change border color to black
                '&:hover': {
                  borderColor: 'black', // Keep border color black on hover
                  backgroundColor: 'rgba(0, 0, 0, 0.1)' // Optional: change background on hover
                }
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={searchOpen} onClose={handleSearchClose}>
        <Box position="absolute" 
             top="50%" 
             left="50%" 
             width={400}
             bgcolor="white"
             border="2px solid #0000"
             boxShadow={24}
             p={4}
             display="flex"
             flexDirection="column"
             gap={3}
             sx={{
              transform: 'translate(-50%, -50%)',
             }}
        >
          {searchResult ? (
            <>
              <Typography variant="h6">Modify Item: {searchResult.name.charAt(0).toUpperCase() + searchResult.name.slice(1)}</Typography>
              <Typography variant="h6">Current Quantity: {searchResult.quantity}</Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" onClick={() => addItem(searchResult.name)}>Add</Button>
                <Button 
                  variant="contained" 
                  onClick={() => removeItem(searchResult.name)}
                  disabled={searchResult.quantity <= 0}
                >
                  Remove
                </Button>
              </Stack>
            </>
          ) : (
            <Typography variant="h6">Item &quot;{searchTerm}&quot; does not exist.</Typography>
          )}
        </Box>
      </Modal>

      <Stack width="800px" direction="row" spacing={3}>
        <Button
          variant="contained"
          onClick={() => handleOpen()}
        >Add New Item</Button>

        <TextField 
          variant="outlined"
          fullWidth
          placeholder="Search item"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
        >Search</Button>
      </Stack>
      

      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="#333">
              Pantry Items
          </Typography>
        </Box>
      
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {
          inventory.map(({name, quantity}) => (
            <Box key={name} 
                 width="100%" 
                 minHeight="150px"
                 display="flex"
                 alignItems="center"
                 justifyContent="space-between"
                 bgcolor="f0f0f0"
                 padding={3}
            >
              <Typography variant="h3" color="#333" textAlign="center" flex="1">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#332" textAlign="center" flex="1">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2} flex="1" justifyContent="flex-end">
                <Button variant="contained" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)} disabled={quantity <= 0}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))
        }
      </Stack>
      </Box>
    </Box>
    </ThemeProvider>
  )
}
