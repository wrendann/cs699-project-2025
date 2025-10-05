from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.shortcuts import redirect

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        # Example: send them to your React app
        return f"https://yourfrontend.com/verify-email/{emailconfirmation.key}"

    def respond_email_verification_sent(self, request, user):
        # Optionally override what happens after registration
        return redirect('https://yourfrontend.com/check-email')
