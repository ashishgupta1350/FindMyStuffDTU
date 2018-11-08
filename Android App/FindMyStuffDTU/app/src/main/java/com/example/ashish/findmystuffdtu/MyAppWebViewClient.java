package com.example.ashish.findmystuffdtu;

import android.content.Intent;
//import android.net.Uri;
import android.net.Uri;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MyAppWebViewClient extends WebViewClient {

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        if(Uri.parse(url).getHost().endsWith("facebook.com")) {
//            console.log(Uri.parse(url).getHost());
            return true;
        }
        if(Uri.parse(url).getHost().length() == 0) {
            return false;
        }
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        view.getContext().startActivity(intent);
        return true;
    }



}