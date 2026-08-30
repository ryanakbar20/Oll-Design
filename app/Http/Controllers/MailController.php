<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use App\Mail\SendToCompany;
use App\Mail\ReplyToSender;

class MailController extends Controller
{
    public function sendEmail(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'company' => 'required|string',
                'name' => 'required|string|max:255',
                'phone' => 'required|string',
                'email' => 'required|email',
                'option' => 'required|string',
                'question' => 'required|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    
        $company = $request->input('company');
        $name = $request->input('name');
        $phone = $request->input('phone');
        $email = $request->input('email');
        $option = $request->input('option');
        $question = $request->input('question');

        $recipientEmail = $email;
        $recipientName = $name;

        $token = $request->input('token'); // Token from the frontend

        // Secret key from Google reCAPTCHA v3
        $secretKey = env('RECAPTCHA_SECRET_KEY');

        // Send request to Google's reCAPTCHA verification endpoint
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => $secretKey,
            'response' => $token,
        ]);

        $responseData = $response->json();

        // Check if the reCAPTCHA validation was successful
        if (!$responseData['success']) {
            return response()->json(['error' => 'reCAPTCHA verification failed'], 400);
        }

        Mail::to($recipientEmail, $recipientName)
            ->send(new ReplyToSender($email, $name, $question));

        $adminEmail = env('MAIL_ADMIN_ADDRESS', 'admin@olldesign.jp');
        $adminName = env('MAIL_ADMIN_NAME', 'Oll-Design');

        Mail::to($adminEmail, $adminName)
            ->send(new SendToCompany($company, $name, $phone, $email, $option, $question));

        return response()->json(['message' => 'Email sent successfully.'], 200);
    }
}
