# Notes for Bakery

## General Information

-   Name TresBakery

## DataBase Design

### 1. Main Information

-   Instagram link
-   Facebook link
-   Youtube link
-   Contact Number
-   Contact Email
-   FAQ
    -   questions
    -   answers
-   analytic numbers
    -   time years
    -   employees count
    -   baked kilograms
    -   destinations
-   map

### 2. Categories

(props get some like special treatment in apis)

-   name
-   image

### 3. Items

-   name
-   cat ref
-   describtion
-   image
-   price

### 4. Users

-   Name
-   email
-   password
-   role
-   locations array
    -   title
    -   address

### 5. orders

(special apis for todays poll on the home page)

-   user ref
-   total price order time
-   delivery location
    -   title
    -   address
-   payment method
-   payment status
-   order status
-   items array
    -   item ref
    -   item name
    -   quantity
    -   price
    -   subtotal

### 6. Gallery

-   images
-   title
-   describtion

### 7. Staff

-   name
-   picture
-   describtion
-   role

### 8. Cooking Videos

-   Video
-   title
-   describtion

### 9. Contests

-   title
-   describtion and recipe
-   image
-   user ref

## Api Design

while responding
all the refrenced items are given along, like instead of only the category id, we also populate its name in item routes etc

### 1. Categories Routes (/categories)

-   /all
    -   all categories except props if exists each with an additional "itemsCount" field.
    -   get
    -   public
-   /propcheck
    -   checks if a category named prop exist s
    -   get
    -   public
-   /admin/add
    -   adds a category (this also uses the multer upload middle ware)
    -   post
    -   admin
-   /admin/change/:id
    -   changes to a category(this may or may not use the multer upload middle ware)
    -   put
    -   admin
-   /admin/delete/:id
    -   deletes a category (but only if like items count is zero other wise not allowed)
    -   delete
    -   admin

### 2. Items Routes (/items)

-   /all
    -   allth items
    -   get
    -   public
-   /:id
    -   get data of one item
    -   get
    -   public
-   /category/:id
    -   gets all items of one category
    -   get
    -   public
-   /admin/add
    -   adds an item (this also uses the multer upload middle ware)
    -   post
    -   admin
-   /admin/change/:id
    -   changes to a item(this may or may not use the multer upload middle ware)
    -   put
    -   admin
-   /admin/delete/:id
    -   deletes an item
    -   delete
    -   admin

### 3. Orders Routes (/order)

-   /order
    -   add another order on the name of the user, this route only gets item id and not other item information, like price and name, it has actively fetch them, this is done so that if an item is deleted then the order still stays valid and working
    -   post
    -   public
-   /my-orders/:userid
    -   gets the orders assosiated with the user, but first authorises if user is allowed to even get the info, no user is given some other persons orders except admin
    -   get
    -   public
-   /this-order/:id
    -   returns the order only if belongs to one requesting or requester is admin
    -   get
    -   public
-   /all-orders
    -   gets all the orders
    -   get
    -   admin
-   /update/:id
    -   allows admins to change the order but only their status(both status) and nothing else
    -   put
    -   admin
-   delete/:id
    -   deletes the order
    -   delete
    -   admin

### 4. Auth

-   /signup
    -   makes a new user (no redundant email)
    -   post
    -   public
-   /login
    -   login to get jwt token
    -   post
    -   public
-   /me
    -   returns currently logged in user data
    -   get
    -   public

### 9. User Profile Routes

-   /me/update-name
    -   updates the name of the currently logged in user
    -   PUT
    -   user
-   /me/change-password
    -   allows the currently logged in user to change their password
    -   PUT
    -   user
-   /me/address
    -   adds a new address to the user's addresses
    -   POST
    -   user
-   /me/address/:addressId
    -   updates an existing address by its id
    -   PUT
    -   user
-   /me/address/:addressId
    -   removes an existing address by its id
    -   DELETE
    -   user
-   /me/addresses
    -   retrieves all addresses associated with the currently logged in user
    -   GET
    -   user
-   /admin/users
    -   retrieves all users
    -   GET
    -   admin
-   /admin/user/:id
    -   retrieves user details for the given id
    -   GET
    -   admin
-   /admin/user/:id
    -   updates a user's role (only role field is modifiable)
    -   PUT
    -   admin
-   /admin/user/:id
    -   deletes the specified user
    -   DELETE
    -   admin

### 5. Gallery Routes (/gallery)

-   /all
    -   retrieves all gallery items
    -   get
    -   public
-   /:id
    -   retrieves a single gallery item
    -   get
    -   public
-   /admin/add
    -   adds a new gallery item (supports image upload)
    -   post
    -   admin
-   /admin/change/:id
    -   updates a gallery item (image upload optional)
    -   put
    -   admin
-   /admin/delete/:id
    -   deletes a gallery item
    -   delete
    -   admin

### 6. Cooking Videos Routes (/cooking-videos)

-   /all
    -   retrieves all cooking videos
    -   get
    -   public
-   /:id
    -   retrieves a single cooking video
    -   get
    -   public
-   /admin/add
    -   adds a new cooking video (supports video upload)
    -   post
    -   admin
-   /admin/change/:id
    -   updates a cooking video
    -   put
    -   admin
-   /admin/delete/:id
    -   deletes a cooking video
    -   delete
    -   admin

### 7. Staff Routes (/staff)

-   /all
    -   retrieves all staff details
    -   get
    -   public
-   /:id
    -   retrieves a single staff member's details
    -   get
    -   public
-   /admin/add
    -   adds a new staff member
    -   post
    -   admin
-   /admin/change/:id
    -   updates a staff member's information
    -   put
    -   admin
-   /admin/delete/:id
    -   deletes a staff member
    -   delete
    -   admin

### 8. General Database Table Routes(/general)

-   /get
    -   Retrieves all information from the general table.
    -   GET
    -   Public
-   /change
    -   Updates an existing information.
    -   PUT
    -   Admin

### 9. Contest Routes (/contests)

-   /post
    -   Creates a new contest.
    -   POST
    -   Public
-   /get
    -   Retrieves all contests.
    -   GET
    -   admin
-   /get/:id
    -   Retrieves a specific contest by ID.
    -   GET
    -   Public
-   /update/:id
    -   Updates a contest by ID.
    -   PUT
    -   admin
-   /delete/:id
    -   Deletes a contest by ID.
    -   DELETE
    -   admin

THERE IS MORE COMMING UP
THE CONTESTS

ASK THEM TO REMOVE CHAT BOT
