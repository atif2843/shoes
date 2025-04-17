import { create } from "zustand";
import { auth, signInWithGoogle, logOut } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const useAuthStore = create( ( set ) => ( {
  user: null,
  isLoginModalOpen: false,
  isLoggedIn: false,

  openLoginModal: () => set( { isLoginModalOpen: true } ),
  closeLoginModal: () => set( { isLoginModalOpen: false } ),

  loginWithGoogle: async () =>
  {
    const user = await signInWithGoogle();
    if ( user )
    {
      set( { user, isLoggedIn: true, isLoginModalOpen: false } );
    }
  },

  logout: async () =>
  {
    await logOut();
    set( { user: null, isLoggedIn: false } );
  },
} ) );

// Automatically check authentication state on app load
onAuthStateChanged( auth, ( user ) =>
{
  useAuthStore.setState( { user, isLoggedIn: !!user } );
} );

export default useAuthStore;
