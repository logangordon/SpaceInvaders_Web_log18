<%-- 
    Document   : index
    Created on : Mar 22, 2016, 7:42:57 PM
    Author     : Logan
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Space Invaders: Log In</title>
        <link rel="stylesheet" type="text/css" href="assets/css/form.css" />
    </head>
    <body>
        <% 
            String failedLogin = request.getParameter("failedLogin");
            if(failedLogin != null && failedLogin.equals("true")){
                out.println("<script>");
                out.println("alert('Unsuccessful login attempt, please try again');");
                out.println("</script>");
            }
        %>
        <h1>Log In</h1>
        <form id="login" name="login" action="LoginVerification" method="post">
            <div id="Username">
                <label id="lblUsername" for="txtUsername">Enter Name: </label>
                <input type="text" id="txtUsername" name="txtUsername"/>
            </div>
            <div id="Password">
                <label id="lblPassword" for="txtPassword">Enter Password:</label>
                <input type="password" id="txtPassword" name="txtPassword" />
            </div>
            <a href="register.jsp">Register</a>
            <input type="submit" id="btnSubmit" value="Log In">
        </form>
    </body>
</html>
