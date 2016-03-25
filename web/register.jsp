<%-- 
    Document   : register
    Created on : Mar 24, 2016, 9:57:44 PM
    Author     : Logan
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href ="assets/css/form.css" />
        <title>Space Invaders: Account Registration</title>
    </head>
    <body>
        <%
            String registrationFailure = request.getParameter("registerFail");
            if(registrationFailure != null && registrationFailure.equals("true")){
                String errorMessage = request.getParameter("error");
                out.println("<script>");
                out.println("alert('"+errorMessage+"')");
                out.println("</script>");
            }
        %>
        <h1>Register</h1>
        <form name="registration" id="registration" action="Registration" method="post">
            <div id="FirstName">
                <label id="lblFirstName" for="txtFirstName">First Name:</label>
                <input name="txtFirstName" id="txtFirstName" type="text" />
            </div>
            <div id="LastName">
                <label id="lblLastName" id="lblLastName">Last Name:</label>
                <input name="txtLastName" id="txtLastName" type="text" />
            </div>
            <div id="Email">
                <label id="lblEmail" for="txtEmail">Email:</label>
                <input id="txtEmail" name="txtEmail" type="text" />
            </div>
            <div id="Password">
                <label id="lblPassword" for="txtPassword">Password:</label>
                <input id="txtPassword" name="txtPassword" type="password" />
            </div>
            <div id="ConfirmPassword">
                <label id="lblConfirmPassword" for="txtConfirmPassword">Confirm Password:</label>
                <input id="txtConfirmPassword" name="txtConfirmPassword" type="password" />
            </div>
            <input id="btnSubmit" name="btnSumbit" type="submit" value="Register"/>
            <a href="index.jsp">Cancel</a>
            
        </form>
    </body>
</html>
