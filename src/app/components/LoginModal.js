"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import useAuthStore from "@/store/useAuthModal";
import { signInWithGoogle } from "@/lib/firebase";
import supabase from "../api/auth/supabaseClient";
import { sendOtp } from "@/lib/firebase";

export default function LoginModal ()
{
  const { isLoginModalOpen, closeLoginModal, loginSuccess } = useAuthStore();
  const [ step, setStep ] = useState( 1 );
  const [ phoneNumber, setPhoneNumber ] = useState( "" );
  const [ otp, setOtp ] = useState( Array( 6 ).fill( "" ) );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( "" );
  const [ confirmationResult, setConfirmationResult ] = useState( null );


  // Reset modal state when it closes
  useEffect( () =>
  {
    if ( !isLoginModalOpen )
    {
      setStep( 1 );
      setPhoneNumber( "" );
      setOtp( Array( 6 ).fill( "" ) );
      setError( "" );
    }
  }, [ isLoginModalOpen ] );

  const handlePhoneSubmit = async () =>
  {
    if ( !/^\d{10}$/.test( phoneNumber ) )
    {
      setError( "Please enter a valid 10-digit phone number" );
      return;
    }

    setError( "" );
    setLoading( true );

    try
    {
      const confirmation = await sendOtp( phoneNumber );
      setConfirmationResult( confirmation );  // ✅ Set confirmationResult here
      setStep( 2 ); // Move to OTP verification step
    } catch ( error )
    {
      setError( error.message );
    } finally
    {
      setLoading( false );
    }
  };

  const handleOtpSubmit = async () =>
  {
    if ( otp.includes( "" ) )
    {
      setError( "Invalid OTP. Please enter all digits." );
      return;
    }

    setError( "" );
    setLoading( true );

    try
    {
      const fullOtp = otp.join( "" ); // Convert OTP array to a string
      const result = await confirmationResult.confirm( fullOtp ); // ✅ Verify OTP
      const userPhone = result.user.phoneNumber; // ✅ Get verified phone number

      // Check if phone number exists in Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from( "users" )
        .select( "id" )
        .eq( "phone", userPhone );

      if ( fetchError )
      {
        console.error( "Error checking user in Supabase:", fetchError );
        setError( "Database error. Please try again." );
        return;
      }

      // If user does not exist, insert into Supabase
      if ( !existingUser || existingUser.length === 0 )
      {
        console.log( "User not found in Supabase, inserting..." );

        const { error: insertError } = await supabase
          .from( "users" )
          .insert( [ { phone: userPhone } ] );

        if ( insertError )
        {
          console.error( "Error inserting user:", insertError );
          setError( "Error saving user data." );
          return;
        }
      }

      loginSuccess(); // ✅ Successfully logged in
    } catch ( error )
    {
      console.error( "OTP Verification Error:", error.message );
      setError( "Invalid OTP. Please try again." );
    } finally
    {
      setLoading( false );
    }
  };


  const handleOtpChange = ( index, value ) =>
  {
    if ( !/^[0-9]?$/.test( value ) ) return;

    setOtp( ( prev ) =>
    {
      const newOtp = [ ...prev ];
      newOtp[ index ] = value;
      return newOtp;
    } );
  };

  return (
    <Dialog open={ isLoginModalOpen } onOpenChange={ closeLoginModal }>
      <DialogContent className="w-[350px] p-6 rounded-lg shadow-lg">
        { step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Welcome! Create an account
            </h2>
            <Input
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={ phoneNumber }
              onChange={ ( e ) => setPhoneNumber( e.target.value ) }
              className="w-full mb-2"
            />
            { error && <p className="text-red-500 text-sm">{ error }</p> }
            <Button
              onClick={ handlePhoneSubmit }
              className="w-full"
              disabled={ loading }
            >
              { loading ? <Loader className="animate-spin" /> : "Register" }
            </Button>
            <div id="recaptcha-container"></div>
            <div className="text-center my-2">OR</div>
            <Button
              onClick={ signInWithGoogle }
              className="w-full bg-red-500 text-white hover:bg-red-600"
            >
              Sign up with Google
            </Button>
          </div>
        ) }

        { step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Enter OTP</h2>
            <div className="flex justify-center gap-2">
              { otp.map( ( char, i ) => (
                <Input
                  key={ i }
                  type="text"
                  maxLength={ 1 }
                  className="w-10 text-center"
                  value={ char }
                  onChange={ ( e ) => handleOtpChange( i, e.target.value ) }
                />
              ) ) }
            </div>
            { error && <p className="text-red-500 text-sm">{ error }</p> }
            <Button
              onClick={ handleOtpSubmit }
              className="w-full mt-3"
              disabled={ loading }
            >
              { loading ? <Loader className="animate-spin" /> : "Submit" }
            </Button>
          </div>
        ) }
      </DialogContent>
    </Dialog>
  );
}
