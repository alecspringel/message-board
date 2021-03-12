# Navigation

This folder contains all of the components related to navigating the web app. These components are always seen on the web page no matter what button you click.

## Component Breakdown

Each component in this folder has specific functionality so we'll break them down one-by-one:

- NavigationWrapper.js handles displaying everything related to this folder. This includes everything in the TopNavBar and also everything in the LeftNavBar
- TopNavBar.js handles the entire top display of the web app. This includes the Inquire logo in the top left, the search bar in the middle, and the profile name and picture/dropdown menu. Within this component are several other components which include:
  - The Inquire logo image located in the imgs folder
  - The SearchBar component located in the common folder
  - The ProfileDropdown component
- ProfileDropdown.js handles creating and displaying the top right hand corner of the TopNavBar. This includes the profile name, picture, and dropdown menu to log out. This component includes:
  - The DropdownOptions component from this folder. We refactored this logic and put it in the common folder but never had enough time to remove this component completely.
  - The Dropdown component from the common folder
- DropdownOptions.js creates the sign out option for the dropdown menu
- LeftNavBar.js handles the entire display for the left navigation bar on the side of the web page. This includes the three buttons for Home, Courses, and Messages. Within this component are:
  - The MenuItem component
  - The home image from the imgs folder
  - The course image from the imgs folder
  - The messages image from the imgs folder
- MenuItem.js handles creating styling and creating the links for the buttons in the LeftNavBar component
