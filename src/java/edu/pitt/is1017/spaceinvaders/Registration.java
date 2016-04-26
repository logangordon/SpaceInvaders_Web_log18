/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.pitt.is1017.spaceinvaders;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Web servlet for creating new user account
 * @author Logan Gordon
 */
@WebServlet(name = "Registration", urlPatterns = {"/Registration"})
public class Registration extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String firstName = request.getParameter("txtFirstName");
        String lastName = request.getParameter("txtLastName");
        String email = request.getParameter("txtEmail");
        String password = request.getParameter("txtPassword");
        String confirmPassword = request.getParameter("txtConfirmPassword");
        
        // error checking
        if(firstName==null || lastName==null || email==null || password==null ||
                firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty()){
            String errorMessage = "All fields must be present";
            response.sendRedirect("register.jsp?registerFail=true&error="+errorMessage);
            return;
        }
        
        // form validation
        if(!password.equals(confirmPassword)){
            String errorMessage = "Passwords must match";
            response.sendRedirect("register.jsp?registerFail=true&error="+errorMessage);
            return;
        }
        
        // Add entry to database by invoke appropriate User constructor
        User user = new User(lastName, firstName, email, password);
        if(user.isLoggedIn()){
            HttpSession session = request.getSession(true);
            session.setAttribute("user", user);
            response.sendRedirect("game.jsp");
        } else {
            HttpSession session = request.getSession(true);
            session.setAttribute("user", null);
            String errorMessage = "Registration failure, please try again";
            response.sendRedirect("register.jsp?registerFail=true&error="+errorMessage);
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
