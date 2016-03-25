<%-- 
    Document   : game.jsp
    Created on : Mar 23, 2016, 12:03:24 AM
    Author     : Logan
--%>

<%@page import="edu.pitt.is1017.spaceinvaders.User"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Space Invaders: The Game</title>
    </head>
    <body>
        <h1>Under Construction</h1>
        <em>Hello, 
            <% User user = (User)session.getAttribute("user");
            out.println(user.getFirstName());%>!
    </body>
</html>
